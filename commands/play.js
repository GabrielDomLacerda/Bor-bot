const { SlashCommandBuilder } = require('@discordjs/builders');
const { GOOGLE_API_KEY, DEFAULT_DELETE_TIME } = require('../config.js')
const axios = require('axios').default
const ytdl = require('ytdl-core');
const { joinVoiceChannel,
        createAudioPlayer,
        NoSubscriberBehavior, 
        AudioPlayerStatus,
        createAudioResource,
    } = require('@discordjs/voice');
const { Events } = require('discord.js');
const { ephemeralReply } = require('../utils.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca a música recebida como parâmetro')
        .addStringOption((option) => 
            option
                .setName('link-ou-busca')
                .setDescription('musica que vai tocar')
                // .setRequired(true)
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
            }, DEFAULT_DELETE_TIME)
            return
        }
        const musicResource = createAudioResource(ytdl(music.url, { filter:'audioonly', quality: 'highestaudio' }))
        serverQueue.player.play(musicResource)
        serverQueue.connection.subscribe(serverQueue.player)
    },
    enqueueMusic: async function (interaction, voiceChannel, guildId, eventType, music) {
        const serverQueue = interaction.client.queue.get(guildId)
        if (!serverQueue) {
            try {
                //CREATING QUEUE FOR GUILD
                const queueContruct = {
                    textChannel: interaction.channel,
                    voiceChannel: voiceChannel,
                    connection: joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: voiceChannel.guild.id,
                        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                        selfDeaf: true, 
                    }),
                    songs: [],
                    volume: 5,
                    player: createAudioPlayer({behaviors: NoSubscriberBehavior.Pause}),
                    playing: true,
                }
                //PUTTING THE MUSIC IN THE QUEUE
                queueContruct.songs.push(music)
                interaction.client.queue.set(interaction.guild.id, queueContruct)
                //PLAYING MUSIC
                this.playMusic(interaction.client, interaction.guild.id, queueContruct.songs[0])
                //EVENTS THAT MAKE THE QUEUE RUN
                queueContruct.player.on(AudioPlayerStatus.Idle, () => {
                    queueContruct.songs.shift()
                    this.playMusic(interaction.client, interaction.guild.id, queueContruct.songs[0])
                })
                ephemeralReply(interaction, `Agora tocando - ${music.title}`, eventType)
                return queueContruct
            } catch (error) {
                console.error(error)
                interaction.client.queue.delete(interaction.guild.id)
                return null
            }
        }
        //IF THE GUILD QUEUE EXISTS, ENQUEUE THE MUSIC
        ephemeralReply(interaction, `${music.title} adicionado à fila`, eventType)
        serverQueue.songs.push(music)
        return serverQueue
    },
    execute: async function (interaction, eventType, parameters) {
        try {
            //TESTING IF THE CALLER IS IN A VOICE CHANNEL
            const voiceChannel = interaction.member.voice.channel
            if (!await replyIfNullOrFalse(voiceChannel, interaction, "Entre em um canal de voz primeiro!", eventType)) { return }
            
            //CHECKING SERVER PERMISSIONS FOR THIS BOT
            const permissions = voiceChannel.permissionsFor(interaction.client.user)
            const hasPermission = (permissions.has('Connect') && permissions.has('Speak'))
            if (!await replyIfNullOrFalse(hasPermission, interaction, "Não possuo permissão para isso", eventType)) { return }

            //HANDLING PAUSE
            if ((eventType == Events.MessageCreate && parameters.length == 0)
             || (eventType == Events.InteractionCreate && !interaction.options.getString('link-ou-busca'))) {
                const serverQueue = interaction.client.queue.get(interaction.guild.id)
                if (!serverQueue) {
                    ephemeralReply(interaction, 'Insira uma música, por favor', eventType)
                } else {
                    serverQueue.player.unpause()
                    ephemeralReply(interaction, `Agora tocando - ${serverQueue.songs[0].title}`, eventType)    
                }
                return
            }

            //HANDLING PARAMETERS AND SEARCHING THE MUSIC WITH YOUTUBE API AND YTDL-CORE
            const params = eventType==Events.MessageCreate? parameters.join(' '): interaction.options.getString('link-ou-busca')
            const musicLink = isLink(params) ? params : buildUrl((await getYtbData(params)).id.videoId)
            const musicInfo = (await ytdl.getInfo(musicLink)).videoDetails
            const music = {
                title: musicInfo.title,
                url: musicLink
            }

            await this.enqueueMusic(interaction, voiceChannel, interaction.guild.id, eventType, music)
        } catch (error) {
            console.error(error)
            ephemeralReply(interaction, "Não foi possível executar esse comando", eventType)
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

async function replyIfNullOrFalse(param, interaction, msg='Não foi possível executar esse comando', eventType='') {
    if (!param) {
        ephemeralReply(interaction, msg, eventType, 3000)
        return false
    }
    return true
}
