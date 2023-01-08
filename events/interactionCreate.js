const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    execute: async function(client, interaction) {
        // console.log(
        //     `${interaction.user.tag} fez uma interação no canal #${interaction.channel.name}.`
        // );
        const command = client.commands.get(interaction.commandName);
        
        if (!command) return;

        try {
            await command.execute(interaction, Events.InteractionCreate);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Tive um erro executando isso!',
                ephemeral: true,
            });
        }
    },
};
