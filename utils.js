const { Events } = require("discord.js")
const { DEFAULT_DELETE_TIME } = require("./config")

module.exports = {
    ephemeralReply: async function(interaction, message, eventType, time=DEFAULT_DELETE_TIME) {
        const reply = await interaction.reply({
            content: message,
            ephemeral: true,
        })
        setTimeout(async () => {
            switch (eventType) {
                case Events.MessageCreate: await reply.delete()
                    break;
                case Events.InteractionCreate: await interaction.deleteReply()
                    break;
                default:
                    break;
            }
        }, time)
    },
}