const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila atual'),
    execute: async function (interaction) {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            await interaction.reply({
                content: 'Lista vazia!',
                ephemeral: true,
            })
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
