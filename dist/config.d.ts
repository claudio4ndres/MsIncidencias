export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}
export interface JwtConfig {
    secret: string;
    expiresIn: string;
}
export interface AppConfig {
    port: number;
    database: DatabaseConfig;
    jwt: JwtConfig;
}
export declare const getAppConfig: () => AppConfig;
