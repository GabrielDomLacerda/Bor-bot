const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeralRespose } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Interrompe a música atual'),
    execute: async function (interaction, eventType, parameters) {
        const serverQueue = interaction.cliente.queue.get(interaction.guild.id)
        if (!serverQueue) {
            ephemeralRespose(interaction, 'Não há nada o que pausar', eventType)
            return;
        }
        serverQueue.player.pause()
        // player.unpause()
        ephemeralRespose(interaction, 'Música pausada', eventType)
    },
};
