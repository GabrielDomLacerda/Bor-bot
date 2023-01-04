const { Events } = require('discord.js');
const { PREFIX } = require('../config');

module.exports = {
    name: Events.MessageCreate,
    async execute(client, msg) {
        if (msg.author.bot) return;
        if (msg.content.startsWith(PREFIX)) {
            const noPrefixMessage = msg.content.slice(PREFIX.length);
            const params = noPrefixMessage.split(' ')
            const name = params.shift()

            const command = client.commands.get(name);

            if (!command) return;

            try {
                await command.execute(msg, params);
            } catch (error) {
                console.error(error);
                await msg.reply({
                    content: 'Tive um erro executando isso!',
                    ephemeral: true,
                });
            }
        }
    },
};
