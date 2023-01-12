const { SlashCommandBuilder } = require('@discordjs/builders');
const { Events } = require('discord.js');
const { ephemeralReply } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila atual')
        .addIntegerOption(option =>
            option
            .setName('pagina')
            .setDescription('Número da página da fila que será mostrado (default: 1)')
        ),
    execute: async function (interaction, eventType, parameters) {
        const serverQueue = interaction.client.queue.get(interaction.guild.id)
        if (!serverQueue) {
            ephemeralReply(interaction, 'Lista vazia!', eventType)
        } else {
            const pageIndex = eventType == Events.InteractionCreate? interaction.options.getInteger('pagina') : parameters.join(' ');
            const maxLength = 2000;
            const queueTitles = serverQueue.songs.map((music, index) => {
                if (index != 0) {
                    return `${index} - ${music.title}`
                } else {
                    return `Tocando agora - ${music.title}`
                }
            })
            const fullText = queueTitles.join('\n')
            if (fullText.length <= maxLength) {
                return await interaction.reply(queueTitles.reverse().join('\n'))
            } else {
                if (!pageIndex || pageIndex <= 0 || pageIndex == 1) {
                    let idxFinal = fullText.slice(0, maxLength - 1).lastIndexOf('\n')
                    return await interaction.reply(
                        fullText.slice(0, idxFinal - 1)
                                .split('\n')
                                .reverse()
                                .join('\n')
                        )
                }
                let actualLength = 0
                const pages = []
                let page = '';
                for (const title of queueTitles) {
                    actualLength += title.length
                    if (actualLength < maxLength) {
                        page += `${title}\n`
                    } else {
                        if (page.endsWith('\n')) {
                            page = page.slice(0, page.lastIndexOf('\n') - 1)
                        }
                        pages.push(page)
                        if (actualLength > maxLength) {
                            page = `${title}\n`
                            actualLength = title.length
                        } else {
                            page = ''
                            actualLength = 0
                        }
                    }
                }
                if (page != '') {
                    pages.push(page)
                }
                try {
                    if (pageIndex > pages.length) {
                        const last = pages.pop()
                        return await interaction.reply(last.split('\n').reverse().join('\n'))
                    } else {
                        const text = pages[pageIndex - 1]
                        return await interaction.reply(text.split('\n').reverse().join('\n'))
                    }
                } catch (error) {
                    ephemeralReply(interaction, "Ocorreu um erro na fila", eventType)
                }

            }
        }
    },
};
