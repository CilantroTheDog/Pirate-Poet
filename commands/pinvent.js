const Discord = require('discord.js');
const Keyv = require('keyv');
const pinChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinChannel.sqlite');
pinChannelStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'pinvent',
	description: 'Vents pinned messages automatically, posting them in the specified channel',
	usage: '[message vent amount] [message skip ammount (Optional)]',
	args: true,
	guildOnly: true,
	numerable: true,
	manageMessages: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			const pinChannelName = await pinChannelStorage.get(message.guild.id);

			if (pinChannelName == null) {
				return message.channel.send(`Please make sure you set a channel to post pinned messages, using the setpinchannel command, ${message.author}`);
			}

			let noSkip = false;

			if (args[1] == null) {
				noSkip = true;
			}

			const pinChannel = message.guild.channels.find(channel => channel.name === pinChannelName);

			const pinnedMessageArray = [];
			message.channel.fetchPinnedMessages()
				.then(messages => {
					if (messages == null) {
						return message.channel.send(`Please make sure this channel has pinned messages, ${message.author}`);
					}
					messages.forEach(pinMessage => {
						pinnedMessageArray.push(pinMessage);
					});
				})
				.then(i => {
					let minIndex;
					let firstMessageDate;
					let secondMessageDate;
					let temp;
					for (i = 0; i < pinnedMessageArray.length - 2; i++) {
						minIndex = i;
						for (let j = 1; j < pinnedMessageArray.length - 1; j++) {
							firstMessageDate = pinnedMessageArray[j].createdAt;
							secondMessageDate = pinnedMessageArray[minIndex].createdAt;
							if (firstMessageDate.getTime() < secondMessageDate.getTime()) {
								minIndex = j;
							}
						}
						temp = pinnedMessageArray[i];
						pinnedMessageArray[i] = pinnedMessageArray[minIndex];
						pinnedMessageArray[minIndex] = temp;
					}

					let pinnedMessage;
					let startIndex;
					if (noSkip) {
						startIndex = pinnedMessageArray.length - 1;
					}
					else {
						startIndex = pinnedMessageArray.length - 1 - args[1];
					}

					const endIndex = startIndex - args[0];
					let messageEmbed;
					for (i = startIndex; i > endIndex; i--) {
						if (i < 0) {
							break;
						}

						pinnedMessage = pinnedMessageArray[i];

						messageEmbed = new Discord.RichEmbed()
							.setColor()
							.setTitle(pinnedMessage.author.username)
							.setDescription(pinnedMessage.content)
							.setThumbnail(pinnedMessage.author.avatarURL)
							.setTimestamp(pinnedMessage.createdAt)
							.addField('Message Link', `[Link](${pinnedMessage.url})`);

						if (pinnedMessage.attachments.array().length > 0) {
							pinnedMessage.attachments.forEach(attachment => {
								console.log(attachment.url);
								messageEmbed.setImage(attachment.url);
							});
						}

						pinChannel.send(messageEmbed);

						pinnedMessage.unpin();
					}

					return message.channel.send(`${args[0]} messages were unpinned and sent to ${pinChannel}, ${message.author}`);
				});
		})();
	},
};