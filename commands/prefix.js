const Keyv = require('keyv');
const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
prefixes.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'prefix',
	description: 'Changes the prefix of a server',
	args: true,
	guildOnly: true,
	manageMessages: true,
	usage: '[prefix]',
	execute(message, args) {
		(async () => {
			if (args[0].length > 1) {
				return message.channel.send('Error: Prefix should only be 1 character.');
			}
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
		})();
	},
};