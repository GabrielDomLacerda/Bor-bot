const { Client, Collection, GatewayIntentBits  } = require('discord.js');
const { TOKEN } = require('./config.js');
const { importFeatures } = require('./importer.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();
importFeatures('commands', (command) => {
    if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
})


importFeatures('events', (event) => {
    if (event.once) {
        client.once(event.name, event.execute.bind(null, client));
    } else {
        client.on(event.name, event.execute.bind(null, client));
    }
})

client.login(TOKEN);
