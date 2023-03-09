const { Client, Collection, GatewayIntentBits } = require("discord.js");
const {
    DS_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
} = require("./config.js");
const { importFeatures } = require("./importer.js");
const SpotifyWebApi = require("spotify-web-api-node");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildEmojisAndStickers,
    ],
});
client.queue = new Map();
client.spotify = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
});

client.spotify
    .clientCredentialsGrant()
    .then((data) => {
        client.spotify.setAccessToken(data.body.access_token);
    })
    .catch((error) => console.error(error));

client.commands = new Collection();
importFeatures("commands", (command, path) => {
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command in ${path} is missing a required "data" or "execute" property.`
        );
    }
});

importFeatures("events", (event, path) => {
    if ("name" in event && "execute" in event) {
        if (event.once) {
            client.once(event.name, event.execute.bind(null, client));
        } else {
            client.on(event.name, event.execute.bind(null, client));
        }
    } else {
        console.log(
            `[WARNING] The event in ${path} is missing a required "name" or "execute" property.`
        );
    }
});

client.login(DS_TOKEN);
