module.exports = {
    VIEWS_DIR:              'client/pages/',
    SALT:                   process.env.SALT,
    DEFAULT_PORT:           8080,
    MONGOHQ_CONN_STRING:    process.env.MONGOHQ_CONN_STRING,
    SESSION_COLLECTION:     'sessions',
    EMAIL_FROM :            'starterkit@gmail.com',
    SMTP_USER:              {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASS
    },
    STRATEGY: {
        twitter: {
            consumerKey: process.env.STRATEGY_TWITTER_CONSUMERKEY,
            consumerSecret: process.env.STRATEGY_TWITTER_CONSUMERSECRET,
            callbackURL: process.env.STRATEGY_TWITTER_URL
        },
        facebook: {
            clientId: process.env.STRATEGY_FACEBOOK_CLIENTID,
            clientSecret: process.env.STRATEGY_FACEBOOK_CLIENTSECRET,
            callbackURL: process.env.STRATEGY_FACEBOOK_URL
        },
        google: {
            returnURL: process.env.STRATEGY_GOOGLE_RETURNURL,
            realm: process.env.STRATEGY_GOOGLE_REALM,
            callbackURL: process.env.STRATEGY_GOOGLE_URL,
            stateless: true
        },
        linkedin: {
            consumerKey: process.env.STRATEGY_LINK_CONSUMERKEY,
            consumerSecret: process.env.STRATEGY_LINK_SECRET,
            callbackURL: process.env.STRATEGY_LINK_URL,
        }
    }
}