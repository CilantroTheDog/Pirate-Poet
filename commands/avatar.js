module.exports = {
	name: 'avatar',
	description: 'Displays the avatar of the specified user',
	aliases: ['icon', 'pfp'],
	args: true,
	usage: '[username]',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL}>`;
		});

		message.channel.send(avatarList);
	},
};