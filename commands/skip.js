const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayer } = require('@discordjs/voice');
const { playMusic } = require('./play')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música (caso não tenha mais nenhuma na fila, funciona como o stop)'),
    execute: async (interaction) => {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            interaction.reply({
                content: 'Não há nada o que parar',
                ephemeral: true,
            })
        } else {
            serverQueue.songs.shift()
            serverQueue.player.stop()
            if (serverQueue.songs.length === 0) {
                serverQueue.connection.destroy()
                interaction.client.queue.delete(interaction.guild.id)
            } else {
                playMusic(interaction.client, interaction.guild.id, serverQueue.songs[0])
            }
        }
    },
};
