const { SlashCommandBuilder } = require("@discordjs/builders");
const { ephemeralReply } = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Interrompe a música atual e limpa a fila"),
    execute: async (interaction, eventType) => {
        const serverQueue = interaction.client.queue.get(interaction.guild.id);
        if (!serverQueue) {
            ephemeralReply(interaction, "Não há nada o que parar", eventType);
        } else {
            serverQueue.connection.destroy();
            interaction.client.queue.delete(interaction.guild.id);
            ephemeralReply(interaction, "Fila encerrada", eventType);
        }
    },
};
