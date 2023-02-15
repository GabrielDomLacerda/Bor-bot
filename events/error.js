const { Events } = require("discord.js");

module.exports = {
    name: Events.Error,
    once: true,
    async execute(client) {
        if (client.queue) {
            client.queue.forEach((k, serverQueue) => {
                if (serverQueue.player) {
                    serverQueue.player.stop();
                }
                if (serverQueue.connection) {
                    serverQueue.connection.destroy();
                }
            });
        }
        console.log(`${client.user.tag} desligando!`);
        client.destroy();
    },
};
