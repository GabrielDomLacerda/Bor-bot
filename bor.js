const { Client, Collection, Intents } = require('discord.js');
const { TOKEN } = require('./config.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith('js')
);

commandFiles.forEach((file) => {
    const path = join(commandsPath, file);
    const command = require(path);
    client.commands.set(command.data.name, command);
});

const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith('.js')
);

eventFiles.forEach((file) => {
    const path = join(eventsPath, file);
    const event = require(path);
    if (event.once) {
        client.once(event.name, event.execute.bind(null, client));
    } else {
        client.on(event.name, event.execute.bind(null, client));
    }
});

client.login(TOKEN);
