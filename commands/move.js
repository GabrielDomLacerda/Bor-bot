const { SlashCommandBuilder } = require("@discordjs/builders");
const { Events } = require("discord.js");
const { ephemeralReply } = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("move uma música para a próxima")
        .addIntegerOption((option) =>
            option
                .setName("id")
                .setDescription("posição da música que vai ser movida")
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
        const nowPlaying = queue.songs.shift();
        queue.songs = [nowPlaying, movingSong, ...queue.songs];
        return await ephemeralReply(
            interaction,
            `${movingSong.title} movida para a posição 1`
        );
    },
};
