const { REST, Routes } = require("discord.js");
const { TOKEN, CLIENT_ID } = require("./config.js");
const { importFeatures } = require("./importer.js");

const commands = [];

importFeatures("commands", async (command) => {
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    }
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

module.exports = {
    // for global commands
    deleteGlobal: async function () {
        await rest
            .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
            .then(() =>
                console.log("Successfully deleted all application commands.")
            )
            .catch(console.error);
    },
    // for guild-based commands
    deleteByGuild: async function (guildId) {
        await rest
            .put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
                body: [],
            })
            .then(() => console.log("Successfully deleted all guild commands."))
            .catch(console.error);
    },
};

const loadAllCommandsGlobal = async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
};

loadAllCommandsGlobal();
