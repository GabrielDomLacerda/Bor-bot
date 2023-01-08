const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Interrompe a música atual e limpa a fila'),
    execute: async (interaction) => {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            interaction.reply({
                content: 'Não há nada o que parar',
                ephemeral: true,
            })
        } else {
            serverQueue.connection.destroy()
            interaction.client.queue.delete(interaction.guild.id)
        }
    },
};
