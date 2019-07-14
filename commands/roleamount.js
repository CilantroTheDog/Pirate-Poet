const Keyv = require('keyv');
const Discord = require('discord.js');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'roleamount',
	description: 'Shows the amount of people subscribed to each self subscribable role.',
	guildOnly: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			const roleArray = await assignRoles.get(message.guild.id);
			const memberArray = message.guild.members.array();

			if (roleArray == null) {
				return message.channel.send(`There are no subscribable roles to count, ${message.author}`);
			}

			let embedString = ``;

			for (const i in roleArray) {
				embedString += '\n';
				let roleAmount = 0;
				for (const j in memberArray) {
					if (memberArray[j].roles.some(role => role.name === roleArray[i])) {
						roleAmount++;
					}
				}
				embedString += `**${roleArray[i]}**: ${roleAmount}`;
			}


			console.log(embedString);

			const roleEmbed = new Discord.RichEmbed()
				.setColor('#0F524B')
				.setTitle('Role Amount List')
				.setDescription(embedString)
				.setThumbnail('https://i.imgur.com/5LuI0Wt.png')
				.setTimestamp();

			message.channel.send(roleEmbed);
		})();
	},
};