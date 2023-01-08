const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeralReply } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila atual'),
    execute: async function (interaction, eventType, parameters) {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            ephemeralReply(interaction, 'Lista vazia!', eventType)
        } else {
            const queueTitles = serverQueue.songs.map((music, index) => {
                if (index != 0) {
                    return `${index + 1} - ${music.title}`
                } else {
                    return `Tocando agora - ${music.title}`
                }
            }).reverse().join('\n')
            // console.log(queueTitles)
            await interaction.reply(queueTitles)
        }
    },
};
