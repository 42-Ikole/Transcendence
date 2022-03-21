export default () => ({
  APP_NAME: process.env.APP_NAME,
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  oauth: {
    INTRA_CLIENT_ID: process.env.INTRA_CLIENT_ID,
    INTRA_CLIENT_SECRET: process.env.INTRA_CLIENT_SECRET,
    REDIRECT_URL: `http://${process.env.DOMAIN_NAME}`, // We redirect to this after OAuth flow
    CALLBACK_URL: `http://${process.env.DOMAIN_NAME}/api/auth/login`, // OAuth provider redirects to this to finalize authentication
  },
  cookie: {
    // TODO: make environment variables and random/secret
    NAME: "CookieName",
    SECRET: "CookieSecret",
  },
});
