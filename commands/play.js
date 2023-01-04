const { SlashCommandBuilder } = require('@discordjs/builders');
const { GOOGLE_API_KEY } = require('../config.js')
const axios = require('axios').default

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca a música recebida como parâmetro'),
    async execute(interaction, parameters) {
        try {
            if (parameters.length > 0) {
                if (isLink(parameters)) {
                    playMusic(interaction.guild, parameters)
                } else {
                    const data = await getYtbData(parameters)
                    const musicLink = buildUrl(data.id.videoId)
                    playMusic(interaction.guild, musicLink)
                }
            }
        } catch (error) {
            console.log(error)
            interaction.reply({
                content: "deu errado",
                ephemeral: true,
            })
        }
    }
}

function buildUrl (id) {
    return `https://www.youtube.com/watch?v=${id}` 
}

async function getYtbData (strList) {
    const baseURL = "https://youtube.googleapis.com/youtube/v3/search"
    const searchText = strList.join(' ')
    const params = {
        part: "id",
          q: searchText,
          key: GOOGLE_API_KEY,
          maxResults: 1
    }
    const data = await makeRequest(baseURL, params)
    return data.items[0];
}

async function makeRequest (base, searchParams) {
    try {
        const params = { params : searchParams}
        const response = await axios.get(base, params)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

function isLink (str) {
    const httpsRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const httpRegex = /^http?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const linkRegex = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    return httpRegex.test(str) || httpsRegex.test(str) || linkRegex.test(str);
}

async function playMusic (guild, musicUrl) {
    console.log(guild)
}
