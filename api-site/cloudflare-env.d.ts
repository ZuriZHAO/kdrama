declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    KDRAMA_ADMIN_ID?: string;
    KDRAMA_ADMIN_EMAIL?: string;
    KDRAMA_RATE_SALT?: string;
  }
}
