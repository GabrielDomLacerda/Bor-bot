const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN, CLIENT_ID, GUILD_ID } = require('./config.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const commands = [];

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith('js')
);

commandFiles.forEach((file) => {
    const path = join(commandsPath, file);
    const command = require(path);
    commands.push(command.data.toJSON());
});

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
