const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('ur moms ping'),
	new SlashCommandBuilder().setName('play').setDescription('Plays music').addStringOption(option => option.setName('query').setDescription('Track name or link.')),
	new SlashCommandBuilder().setName('stop').setDescription('stoop playing teh music')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Updated application commands.'))
	.catch(console.error);