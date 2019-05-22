const Keyv = require('keyv');
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
			const data = [];
			const { commands } = message.client;

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

			if (!args.length) {
				data.push('Here\'s a list of all my commands:');
				data.push(commands.map(command => command.name).join(', '));
				data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

				return message.author.send(data, { split: true })
					.then(() => {
						if (message.channel.type === 'dm') return;
						message.reply('I\'ve sent you a DM with all my commands!');
					})
					.catch(error => {
						console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
						message.reply('it seems like I can\'t DM you!');
					});
			}

			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}

			data.push(`**Name:** ${command.name}`);

			if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

			message.channel.send(data, { split: true });
		})();
	},
};