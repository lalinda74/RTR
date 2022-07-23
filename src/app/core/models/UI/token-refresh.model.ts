export interface TokenRefreshModel {
    grant_type: string;
    refresh_token: string | null;
}