const Keyv = require('keyv');
const exitStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/exitMessage.sqlite');
exitStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'setexitmessage',
	description: 'Sets the message the bot posts in the exit channel',
	usage: '[channel name]',
	args: true,
	guildOnly: true,
	manageMessages: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			let exitMessage = args[0];
			for (let i = 1; i < args.length; i++) {
				exitMessage = exitMessage + ' ' + args[i];
			}

			await exitStorage.set(message.guild.id, exitMessage);

			return message.channel.send(`The message has been set as the exit message, ${message.author}`);
		})();
	},
};