module.exports = {
	name: 'fl',
	description: 'Displays fallen london profile of a specified character',
	aliases: ['profile'],
	args: true,
	usage: '[username]',
	execute(message, args) {
		let profile = args[0];
		for (let i = 1; i < args.length; i++) {
			profile = profile + '%20' + args[i];
		}
		return message.channel.send('https://www.fallenlondon.com/profile/' + profile);
	},
};