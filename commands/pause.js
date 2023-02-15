const { SlashCommandBuilder } = require("@discordjs/builders");
const { ephemeralReply } = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Interrompe a música atual"),
    execute: async function (interaction, eventType, parameters) {
        const serverQueue = interaction.client.queue.get(interaction.guild.id);
        if (!serverQueue) {
            ephemeralReply(interaction, "Não há nada o que pausar", eventType);
            return;
        }
        serverQueue.player.pause();
        // player.unpause()
        ephemeralReply(interaction, "Música pausada", eventType);
    },
};
