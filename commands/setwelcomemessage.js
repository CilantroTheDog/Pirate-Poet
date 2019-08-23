const Keyv = require('keyv');
const welcomeStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/welcomeMessage.sqlite');
welcomeStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'setwelcomemessage',
	description: 'Sets the message the bot posts in the welcome channel',
	usage: '[channel name]',
	args: true,
	guildOnly: true,
	manageMessages: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			let welcomeMessage = args[0];
			for (let i = 1; i < args.length; i++) {
				welcomeMessage = welcomeMessage + ' ' + args[i];
			}

			await welcomeStorage.set(message.guild.id, welcomeMessage);

			return message.channel.send(`The message has been set as the welcome message, ${message.author}`);
		})();
	},
};