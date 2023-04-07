# Autenticación básica con passport

Practicando autenticación con passport antes de ir a Nestjs


## Cómo generar un access token

```json
{
    "grant_type": "refresh_token",
    "client_id": "ID_FROM_GOOGLE_CLOUD",
    "client_secret": "SECRET_FROM_GOOGLE_CLOUD",
    "refresh_token": "USER-REFRESH-TOKEN"
}
```

## Cómo ontener un refresh token

```txt
Step 1: Set authorization parameters

POST https://developers.google.com/identity/protocols/oauth2/web-server#node
```

## Vencimiento de refresh token

```txt
https://developers.google.com/identity/protocols/oauth2?hl=es-419
```