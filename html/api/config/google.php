
<?php

// Google OAuth 設定

$googleClientId = getenv('GOOGLE_CLIENT_ID');
$googleClientSecret = getenv('GOOGLE_CLIENT_SECRET');
$googleRedirectUri = getenv('GOOGLE_REDIRECT_URI');

if (
    !$googleClientId ||
    !$googleClientSecret ||
    !$googleRedirectUri
) {
    throw new RuntimeException(
        'Google OAuth configuration is missing.'
    );
}

return [
    'client_id' => $googleClientId,
    'client_secret' => $googleClientSecret,
    'redirect_uri' => $googleRedirectUri,

    'authorization_endpoint' =>
        'https://accounts.google.com/o/oauth2/v2/auth',

    'token_endpoint' =>
        'https://oauth2.googleapis.com/token',

    'userinfo_endpoint' =>
        'https://openidconnect.googleapis.com/v1/userinfo',

    'scopes' => [
        'openid',
        'email',
        'profile'
    ]
];
