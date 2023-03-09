const { config } = require("dotenv");

config();

module.exports = {
    DS_TOKEN: process.env.DS_TOKEN,
    DS_PUBLIC_KEY: process.env.DS_PUBLIC_KEY,
    DS_CLIENT_SECRET: process.env.DS_CLIENT_SECRET,
    DS_CLIENT_ID: process.env.DS_CLIENT_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_SECRET_TOKEN: process.env.GOOGLE_SECRET_TOKEN,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    PREFIX: "!",
    DEFAULT_DELETE_TIME: 5000,
};
