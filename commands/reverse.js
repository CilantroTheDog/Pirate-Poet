module.exports = {
	name: 'reverse',
	description: 'Reverses a message',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		let string = args[0];
		for (let i = 1; i < args.length; i++) {
			string = string + ' ' + args[i];
		}

		string = string.split('').reverse().join('');

		return message.channel.send(string);
	},
};