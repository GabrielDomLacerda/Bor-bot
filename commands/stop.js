const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Interrompe a música atual e limpa a fila'),
    execute: async (interaction, eventType) => {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            ephemeralResponse(interaction, 'Não há nada o que parar', eventType)
        } else {
            serverQueue.connection.destroy()
            interaction.client.queue.delete(interaction.guild.id)
            ephemeralResponse(interaction, 'Fila encerrada', eventType)
        }
    },
};
