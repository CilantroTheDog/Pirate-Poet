const Keyv = require('keyv');
const welcomeStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/welcomeChannel.sqlite');
welcomeStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'setwelcomechannel',
	description: 'Sets the channel the bot posts welcome messages in.',
	usage: '[channel name]',
	args: true,
	guildOnly: true,
	manageMessages: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			if (message.guild.channels.find(channel => channel.name === args[0]) == null) {
				return message.channel.send(`Please make sure your channel exists in this server, ${message.author}`);
			}

			await welcomeStorage.set(message.guild.id, args[0]);

			return message.channel.send(`The channel ${args[0]} has been set as the welcome channel, ${message.author}`);
		})();
	},
};