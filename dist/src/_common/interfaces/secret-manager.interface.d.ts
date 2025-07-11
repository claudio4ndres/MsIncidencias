export interface DbUserSecretManager {
    username: string;
    password: string;
    engine: string;
    host: string;
    port: number;
    dbClusterIdentifier: string;
}
export interface DbHostSecretManager {
    DB_HOST_WRITE: string;
    DB_HOST_READ: string;
}
export interface JwtConfigSecretManager {
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
}
export interface GoogleCaptchaSecretManager {
    GG_CAPTCHA_KEY: string;
    GG_CAPTCHA_URL: string;
}
