const Keyv = require('keyv');
const pinChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinChannel.sqlite');
pinChannelStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'setpinchannel',
	description: 'Selects the channel to put pinned messages when they are vented in',
	usage: '[pinned channel name]',
	args: true,
	guildOnly: true,
	manageMessages: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			if (message.guild.channels.find(channel => channel.name === args[0]) == null) {
				return message.channel.send(`Please make sure your channel exists in this server, ${message.author}`);
			}

			await pinChannelStorage.set(message.guild.id, args[0]);

			return message.channel.send(`The channel ${args[0]} has been set as the pin vent channel, ${message.author}`);
		})();
	},
};