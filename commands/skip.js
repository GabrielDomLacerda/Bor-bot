const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeralRespose } = require('../utils');
const { playMusic } = require('./play')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música (caso não tenha mais nenhuma na fila, funciona como o stop)'),
    execute: async (interaction, eventType, parameters) => {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            ephemeralRespose(interaction, 'Não há nada o que parar', eventType)
        } else {
            serverQueue.songs.shift()
            serverQueue.player.stop()
            if (serverQueue.songs.length === 0) {
                serverQueue.connection.destroy()
                interaction.client.queue.delete(interaction.guild.id)
                ephemeralRespose(interaction, 'Fila encerrada', eventType)
            } else {
                ephemeralRespose(interaction, `Agora tocando - ${serverQueue.songs[0].title}`, eventType)
                playMusic(interaction.client, interaction.guild.id, serverQueue.songs[0])
            }
        }
    },
};
