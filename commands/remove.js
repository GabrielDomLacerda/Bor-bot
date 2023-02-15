const { SlashCommandBuilder } = require("@discordjs/builders");
const { Events } = require("discord.js");
const { ephemeralReply } = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("remove uma música")
        .addIntegerOption((option) =>
            option
                .setName("id")
                .setDescription("posição da música que vai ser removida")
        ),
    execute: async function (interaction, eventType, parameters) {
        const queue = interaction.client.queue.get(interaction.guild.id);
        if (!queue) {
            return await ephemeralReply(
                interaction,
                "Não estou tocando nada!",
                eventType
            );
        }
        const idMusic =
            eventType == Events.InteractionCreate
                ? interaction.options.getInteger("id")
                : parameters.join(" ");
        if (idMusic < 1 || idMusic > queue.songs.length) {
            return await ephemeralReply(
                interaction,
                "Música inválida",
                eventType
            );
        }
        const movingSong = queue.songs.splice(idMusic, 1)[0];
        return await ephemeralReply(
            interaction,
            `${movingSong.title} removida da fila!`
        );
    },
};
