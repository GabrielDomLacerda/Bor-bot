const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeralReply } = require('../utils');
const queueCommand = require('./queue')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Embaralha a lista de música'),
    execute: async function (interaction, eventType, parameters) {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            ephemeralReply(interaction, 'Não há músicas na fila!', eventType)
        } else {
            if (serverQueue.songs.length != 0) {
                const playingMusic = serverQueue.songs.shift()
                serverQueue.songs = [playingMusic, ...serverQueue.songs.sort(() => .5 - Math.random())]
            }
            // ephemeralReply(interaction, 'Fila embaralhada com sucesso!', eventType)
            //EXECUTING QUEUE.JS
            queueCommand.execute(interaction, eventType)
        }

    },
};
