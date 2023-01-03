const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        console.log(
            `${interaction.user.tag} fez uma interação no canal #${interaction.channel.name}.`
        );

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Tive um erro executando isso!',
                ephemeral: true,
            });
        }
    },
};
