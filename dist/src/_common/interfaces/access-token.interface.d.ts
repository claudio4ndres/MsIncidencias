export interface IAccessToken {
    readonly channel: string;
    readonly sub: string;
    readonly iss: string;
    readonly iat: number;
    readonly exp: number;
}
export interface AccessToken {
    readonly sub: string;
    readonly iss: string;
    readonly iat?: number;
    readonly exp?: number;
    readonly channel: 'Web';
    readonly hash?: string;
}
