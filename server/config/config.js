config = {};

config.mongoUrlForHeroku = 'mongodb://heroku_z2q37bqr:ok3bdd4sh7014gbkphomrq5aha@ds123370.mlab.com:23370/heroku_z2q37bqr';
config.mongoUrlForLocalDB = 'mongodb://localhost/gatheringDB';

config.secretKey = '12345-67890-09876-54321';

config.facebook = {
	clientID: '115476552217690',
    clientSecret: '341f09f1b96fa2174ef433315011165f',
    callbackURL: 'https://obscure-dawn-49938.herokuapp.com/authenticate/facebook/callback'
};

// Secret for session, you will want to change this and make it an environment variable
config.secrets = {
    session: 'myGathering-secret'
};

module.exports = config;