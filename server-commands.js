const { REST, Routes } = require( 'discord.js');
const { TOKEN, CLIENT_ID } = require( './config.js');
const { importFeatures } = require( './importer.js');

const commands = [];

importFeatures('commands', async (command) => {
    commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID), 
            { body: commands, }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
