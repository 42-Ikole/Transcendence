export default () => ({
  APP_NAME: process.env.APP_NAME,
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  oauth: {
    intra: {
      CLIENT_ID: process.env.INTRA_CLIENT_ID,
      CLIENT_SECRET: process.env.INTRA_CLIENT_SECRET,
      CALLBACK_URL: `http://${process.env.DOMAIN_NAME}/api/auth/login/intra`, // OAuth provider redirects to this to finalize authentication
    },
    github: {
      CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      CALLBACK_URL: `http://${process.env.DOMAIN_NAME}/api/auth/login/github`, // OAuth provider redirects to this to finalize authentication
    },
    discord: {
      CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
      CALLBACK_URL: `http://${process.env.DOMAIN_NAME}/api/auth/login/github`, // OAuth provider redirects to this to finalize authentication
    },
    REDIRECT_URL: `http://${process.env.DOMAIN_NAME}`, // We redirect to this after OAuth flow
  },
  cookie: {
    // TODO: make environment variables and random/secret
    NAME: 'CookieName',
    SECRET: 'CookieSecret',
  },
});
