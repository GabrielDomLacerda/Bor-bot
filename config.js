const { config } = require('dotenv');

config();

module.exports = {
    TOKEN: process.env.TOKEN,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GUILD_ID: process.env.GUILD_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_SECRET_TOKEN: process.env.GOOGLE_SECRET_TOKEN,
    PREFIX: '!',
    DEFAULT_DELETE_TIME: 5000,
};
