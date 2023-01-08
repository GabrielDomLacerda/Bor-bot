const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async function(client) {
        console.log(`${client.user.tag} pronto para soltar o som!`);
    },
};
