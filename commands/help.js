const Keyv = require('keyv');
const Discord = require('discord.js');
const { globalprefix } = require('./../env.json');
const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
prefixes.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(message, args) {
		(async () => {
			const { commands } = message.client;
			const commandArray = commands.array();

			let prefix;

			// Messy

			if (!message.guild) {
				prefix = globalprefix;
			}
			else {
				const guildPrefix = await prefixes.get(message.guild.id);

				if (guildPrefix != null && guildPrefix != globalprefix) {
					prefix = guildPrefix;
				}
				else {
					prefix = globalprefix;
				}
			}

			const helpEmbed = new Discord.RichEmbed()
				.setColor('#0F524B')
				.setThumbnail('https://i.imgur.com/5LuI0Wt.png')
				.setTimestamp();

			if (!args.length) {
				helpEmbed.setTitle('Commands List');

				for (let i = 0; i < commandArray.length; i++) {
					helpEmbed.addField(commandArray[i].name, commandArray[i].description);
				}
			}
			else {
				const name = args[0].toLowerCase();
				const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

				if (!command) {
					return message.reply('that\'s not a valid command!');
				}

				helpEmbed.setTitle(command.name);

				if (command.aliases) {
					helpEmbed.addField('Aliases', command.aliases.join(', '));
				}
				if (command.description) {
					helpEmbed.addField('Description', command.description);
				}
				if (command.usage) {
					helpEmbed.addField('Usage', `${prefix}${command.name} ${command.usage}`);
				}
			}

			message.channel.send(helpEmbed);
		})();
	},
};