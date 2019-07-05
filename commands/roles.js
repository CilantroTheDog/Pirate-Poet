const Keyv = require('keyv');
const Discord = require('discord.js');
const { globalprefix } = require('./../env.json');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
const assignNames = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignNames.sqlite');
const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
const descriptionKeys = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/description.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));
assignNames.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'roles',
	description: 'Displays all the self assignable roles for the server',
	guildOnly: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			const roleArray = await assignRoles.get(message.guild.id);
			const nameArray = await assignNames.get(message.guild.id);
			const descriptionArray = await descriptionKeys.get(message.guild.id);

			let empty = false;

			if (roleArray == null || nameArray == null) {
				return message.channel.send(`There are no roles to subscribe to, ${message.author}`);
			}

			if (descriptionArray == null) {
				empty = true;
			}

			let prefix;

			const guildPrefix = await prefixes.get(message.guild.id);

			if (guildPrefix != null && guildPrefix != globalprefix) {
				prefix = guildPrefix;
			}
			else {
				prefix = globalprefix;
			}

			const roleEmbed = new Discord.RichEmbed()
				.setColor('#0F524B')
				.setTitle('Roles List')
				.setDescription('The roles you can subscribe to, and what command you use to acquire them.')
				.setThumbnail('https://i.imgur.com/5LuI0Wt.png')
				.setTimestamp();

			for (let i = 0; i < roleArray.length; i++) {
				if (!empty) {
					let descriptionIndex = -1;
					for (let j = 0; j < descriptionArray.length; j++) {
						if (roleArray[i] == descriptionArray[j][0]) {
							descriptionIndex = j;
							break;
						}
					}

					if (descriptionIndex == -1) {
						roleEmbed.addField(roleArray[i], `\`${prefix}sub ${nameArray[i]}\``, true);
					}
					else {
						roleEmbed.addField(roleArray[i], `${descriptionArray[descriptionIndex][1]}\n\`${prefix}sub ${nameArray[i]}\``, true);
					}
				}
				else {
					roleEmbed.addField(roleArray[i], `\`${prefix}sub ${nameArray[i]}\``, true);
				}
			}

			message.channel.send(roleEmbed);
		})();
	},
};