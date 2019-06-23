module.exports = {
	name: 'fl',
	description: 'Displays fallen london profile of a specified character',
	aliases: ['profile'],
	args: true,
	usage: '[username]',
	execute(message, args) {
		(async () => {
			let profile = args[0];
			for (let i = 1; i < args.length; i++) {
				profile = profile + '%20' + args[i];
			}

			const link = 'https://www.fallenlondon.com/profile/' + profile;

			return message.channel.send(link);
		})();
	},
};