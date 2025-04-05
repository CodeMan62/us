use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder, http::header};
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgPoolOptions};
use sqlx::Row;
use std::env;
use uuid::Uuid;
use chrono;

#[derive(Debug, Serialize, Deserialize)]
struct ShortUrl {
    id: String,
    original_url: String,
    short_code: String,
    expiration_date: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateShortUrl {
    original_url: String,
    custom_slug: Option<String>,
    expiration_date: Option<chrono::DateTime<chrono::Utc>>,
}

async fn create_short_url(
    data: web::Json<CreateShortUrl>,
    pool: web::Data<PgPool>,
) -> impl Responder {
    // Generate short code or use custom slug
    let short_code = match &data.custom_slug {
        Some(slug) => slug.clone(),
        None => Uuid::new_v4().to_string()[..8].to_string(),
    };
    let id = Uuid::new_v4().to_string();

    println!("Attempting to create short URL for: {}", data.original_url);

    // Check if custom slug is already taken
    if let Some(custom_slug) = &data.custom_slug {
        let exists = sqlx::query("SELECT COUNT(*) FROM urls WHERE short_code = $1")
            .bind(custom_slug)
            .fetch_one(pool.get_ref())
            .await;

        match exists {
            Ok(row) => {
                let count: i64 = row.get(0);
                if count > 0 {
                    return HttpResponse::BadRequest()
                        .json("Custom slug is already taken");
                }
            }
            Err(e) => {
                eprintln!("Database error checking slug availability: {:?}", e);
                return HttpResponse::InternalServerError()
                    .json("Failed to check slug availability");
            }
        }
    }

    let result = sqlx::query(
        r#"
        INSERT INTO urls (id, original_url, short_code, expiration_date)
        VALUES ($1, $2, $3, $4)
        RETURNING id, original_url, short_code, expiration_date
        "#
    )
    .bind(&id)
    .bind(&data.original_url)
    .bind(&short_code)
    .bind(&data.expiration_date)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(row) => {
            let url = ShortUrl {
                id: row.get("id"),
                original_url: row.get("original_url"),
                short_code: row.get("short_code"),
                expiration_date: row.get("expiration_date"),
            };
            println!("Successfully created short URL with code: {}", url.short_code);
            HttpResponse::Ok().json(url)
        }
        Err(e) => {
            eprintln!("Database error during URL creation: {:?}", e);
            HttpResponse::InternalServerError().json(format!("Failed to create short URL: {:?}", e))
        }
    }
}

async fn get_original_url(
    short_code: web::Path<String>,
    pool: web::Data<PgPool>,
) -> impl Responder {
    println!("Looking up URL for short code: {}", short_code);

    let result = sqlx::query(
        r#"
        SELECT original_url, expiration_date 
        FROM urls 
        WHERE short_code = $1
        "#
    )
    .bind(short_code.as_str())
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(row) => {
            let url: String = row.get("original_url");
            let expiration_date: Option<chrono::DateTime<chrono::Utc>> = row.get("expiration_date");
            
            // Check if URL has expired
            if let Some(exp_date) = expiration_date {
                if exp_date < chrono::Utc::now() {
                    return HttpResponse::Gone().json("URL has expired");
                }
            }
            
            println!("Redirecting to URL: {}", url);
            HttpResponse::Found()
                .append_header((header::LOCATION, url))
                .finish()
        }
        Err(e) => {
            eprintln!("Error looking up URL: {:?}", e);
            HttpResponse::NotFound().json(format!("URL not found: {:?}", e))
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    println!("Connecting to database...");
    
    let pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
    {
        Ok(pool) => {
            println!("Successfully connected to database");
            pool
        }
        Err(e) => {
            eprintln!("Failed to connect to database: {:?}", e);
            panic!("Database connection failed");
        }
    };

    println!("Creating/updating table schema...");
    match sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS urls (
            id VARCHAR PRIMARY KEY,
            original_url VARCHAR NOT NULL,
            short_code VARCHAR NOT NULL UNIQUE,
            expiration_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(&pool)
    .await
    {
        Ok(_) => println!("Table creation/verification successful"),
        Err(e) => {
            eprintln!("Failed to create/verify table: {:?}", e);
            panic!("Table creation failed");
        }
    }

    println!("Starting server at http://127.0.0.1:8080");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(pool.clone()))
            .service(
                web::resource("/api/urls")
                    .route(web::post().to(create_short_url)),
            )
            .service(
                web::resource("/{short_code}")
                    .route(web::get().to(get_original_url)),
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
