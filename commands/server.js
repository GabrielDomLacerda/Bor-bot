const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Diz informações sobre o server"),
    async execute(interaction, eventType, parameters) {
        await interaction.reply(
            `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
    },
};
