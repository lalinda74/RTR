export const AuthConfig = {
    responseType: 'code,id_token',
    redirectURI: 'http://localhost:4200/login/auth',
    grant_type: {
        initial: 'authorization_code',
        refresh: 'refresh_token'
    }
}