const { SlashCommandBuilder } = require('@discordjs/builders');
const { GOOGLE_API_KEY } = require('../config.js')
const axios = require('axios').default
const ytdl = require('ytdl-core');
const { joinVoiceChannel,
        createAudioPlayer,
        NoSubscriberBehavior, 
        AudioPlayerStatus,
        createAudioResource,
    } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca a música recebida como parâmetro')
        .addStringOption((option) => 
            option
                .setName('link-ou-busca')
                .setDescription('musica que vai tocar')
                .setRequired(true)
        ),
        playMusic: async function(client, guildId, music) {
            const serverQueue = client.queue.get(guildId)
            if (!(music.url)) {
                setTimeout(() => {
                    if (serverQueue.songs.length === 0) {
                        serverQueue.connection.destroy() 
                        client.queue.delete(guildId)
                    } else {
                        this.playMusic(client, guildId, serverQueue.songs[0])
                    }
                }, 5000)
                return
            }
            const musicResource = createAudioResource(ytdl(music.url, { filter:'audioonly', quality: 'highestaudio' }))
            serverQueue.player.play(musicResource)
            serverQueue.connection.subscribe(serverQueue.player)
        },
    execute: async function (interaction, parameters) {
        try {
            const isMessage = parameters? true : false
            const voiceChannel = interaction.member.voice.channel
            if (!await replyIfNullOrFalse(voiceChannel, interaction, "Entre em um canal de voz primeiro!", isMessage)) { return }

            const permissions = voiceChannel.permissionsFor(interaction.client.user)
            const hasPermission = (permissions.has('Connect') && permissions.has('Speak'))
            if (!await replyIfNullOrFalse(hasPermission, interaction, "Não possuo permissão para isso", isMessage)) { return }

            const params = isMessage? parameters.join(' '): interaction.options.getString('link-ou-busca')
            if (!await replyIfNullOrFalse(params, interaction, "Por favor, insira uma música", isMessage)) { return }

            const musicLink = isLink(params) ? params : buildUrl((await getYtbData(params)).id.videoId)
            const musicInfo = (await ytdl.getInfo(musicLink)).videoDetails
            const music = {
                title: musicInfo.title,
                url: musicLink
            }

            const serverQueue = interaction.client.queue.get(interaction.guild.id)
            if (!serverQueue) {
                try {
                    const queueContruct = {
                        textChannel: interaction.channel,
                        voiceChannel: voiceChannel,
                        connection: joinVoiceChannel({
                            channelId: voiceChannel.id,
                            guildId: voiceChannel.guild.id,
                            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                            // selfDeaf: true, 
                        }),
                        songs: [],
                        volume: 5,
                        player: createAudioPlayer({behaviors: NoSubscriberBehavior.Pause}),
                        playing: true,
                    }
                    queueContruct.songs.push(music)
                    interaction.client.queue.set(interaction.guild.id, queueContruct)
                    this.playMusic(interaction.client, interaction.guild.id, queueContruct.songs[0])
                    queueContruct.player.on(AudioPlayerStatus.Idle, () => {
                        queueContruct.songs.shift()
                        this.playMusic(interaction.client, interaction.guild.id, queueContruct.songs[0])
                    })
                } catch (error) {
                    console.error(error)
                    interaction.client.queue.delete(interaction.guild.id)
                }
            } else {
                serverQueue.songs.push(music)
            }
        } catch (error) {
            console.error(error)
            interaction.reply({
                content: "Não foi possível executar esse comando",
                ephemeral: true,
            })
        }
    },
    
}

function buildUrl (id) {
    return `https://www.youtube.com/watch?v=${id}` 
}

async function getYtbData (searchText) {
    const baseURL = "https://youtube.googleapis.com/youtube/v3/search"
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
        console.error(error)
    }
}

function isLink (str) {
    const ytbRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/;
    const httpsRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const httpRegex = /^http?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const linkRegex = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    // return httpRegex.test(str) || httpsRegex.test(str) || linkRegex.test(str) || ytbRegex.test(str);
    return ytbRegex.test(str);
}

async function replyIfNullOrFalse(param, interaction, msg='Não foi possível executar esse comando', isMessage=false) {
    if (!param) {
        const message = await interaction.reply({
            content: msg, 
            ephemeral: true
        })
        if (isMessage) {
            setTimeout(async () => await message.delete(), 3000)
        }
        return false
    }
    return true
}
