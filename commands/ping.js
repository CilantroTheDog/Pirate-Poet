module.exports = {
	name: 'ping',
	description: 'Returns the time it takes for the bot to read the message',
	args: false,
	execute(message, args) {
		// Sends a placeholder message to compare times
		message.channel.send(':ping_pong: Pong!').then(newMessage => {
			// Subtracts this message"s time by the user"s message to calculate ping
			newMessage.edit(`This message took \`${Math.round(newMessage.createdTimestamp - message.createdTimestamp)} ms\` to reach you!`);
			// Checks to see if there is a 0 or negative ping value, then displays error message
			if (Math.round(newMessage.createdTimestamp - message.createdTimestamp <= 0)) {
				message.channel.send('Wait a minute, that can"t be right...');
			}
		});
	},
};