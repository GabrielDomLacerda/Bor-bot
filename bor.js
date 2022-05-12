import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log(`${client.user.tag} pronto para soltar o som!`);
});

client.on('interactionCreate', async (interaction) => {
    console.log(
        `${interaction.user.tag} fez uma interação em #${interaction.channel.name}.`
    );
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    await msg.reply(`Olá, @${msg.author.tag}`);
});

client.login(process.env.TOKEN);
