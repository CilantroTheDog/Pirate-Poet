const Discord = require('discord.js');
const Keyv = require('keyv');
const globalprefix = '~';
const pinChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinChannel.sqlite');
pinChannelStorage.on('error', err => console.error('Keyv connection error:', err));

const pinRetainEmoteStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinRetainEmote.sqlite');
pinRetainEmoteStorage.on('error', err => console.error('Keyv connection error:', err));

const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
prefixes.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'pinvent',
	description: 'Vents pinned messages automatically, posting them in the specified channel',
	usage: '[message vent amount] [message skip amount (Optional)]',
	args: true,
	guildOnly: true,
	numerable: true,
	manageMessages: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			const pinChannelName = await pinChannelStorage.get(message.guild.id);
			const pinRetainEmojiObject = await pinRetainEmoteStorage.get(message.guild.id);
			const guildPrefix = await prefixes.get(message.guild.id);
			const pinnedMessageArray = [];

			let i, pinnedMessage, startIndex, normalMessage, messageReaction, pinID;
			let noSkip = false;
			let recurse = false;
			let adminUser = false;

			if (pinChannelName == null) {
				return message.channel.send(`Please make sure you set a channel to post pinned messages, using the setpinchannel command, ${message.author}`);
			}

			if (args[1] == null) {
				noSkip = true;
			}

			const pinChannel = message.guild.channels.find(channel => channel.name === pinChannelName);

			const messages = await message.channel.fetchPinnedMessages();

			if (messages == null) {
				return message.channel.send(`Please make sure this channel has pinned messages, ${message.author}`);
			}
			messages.forEach(pinMessage => {
				pinnedMessageArray.push(pinMessage);
			});

			pinnedMessageArray.sort(function(a, b) {
				return b.createdAt.getTime() - a.createdAt.getTime();
			});

			if (noSkip) {
				startIndex = pinnedMessageArray.length - 1;
			}
			else {
				startIndex = pinnedMessageArray.length - 1 - args[1];
			}

			const endIndex = startIndex - args[0];
			for (i = startIndex; i > endIndex; i--) {
				if (i < 0) {
					break;
				}

				pinnedMessage = pinnedMessageArray[i];

				if (pinRetainEmojiObject != null) {
					pinID = pinnedMessage.id;
					pinnedMessage.channel.messages.delete(pinID);
					normalMessage = await pinnedMessage.channel.fetchMessage(pinID);

					if (pinRetainEmojiObject.isCustom) {
						messageReaction = normalMessage.reactions.find(reaction => reaction.emoji.id === pinRetainEmojiObject.emoji.id);
					}
					else {
						messageReaction = normalMessage.reactions.find(reaction => reaction.emoji.name === pinRetainEmojiObject.emoji);
					}

					if (messageReaction != null) {
						recurse = true;
						const users = await messageReaction.fetchUsers();
						users.forEach(tempUser => {
							if (normalMessage.guild.members.find(guildmember => guildmember.user.id === tempUser.id).hasPermission('MANAGE_MESSAGES')) {
								adminUser = true;
							}
						});
					}

					if (recurse && adminUser) {
						const dummyMessage = new Discord.Message();

						dummyMessage.channel = normalMessage.channel;
						dummyMessage.guild = normalMessage.channel.guild;

						const prefix = guildPrefix ? guildPrefix : globalprefix;

						dummyMessage.content = `${prefix}pinvent ${startIndex - endIndex} 1`;

						const args2 = dummyMessage.content.slice(prefix.length).split(/ +/);
						args2.shift().toLowerCase();

						return module.exports.execute(dummyMessage, args2);
					}
				}
				else {
					normalMessage = pinnedMessage;
				}

				const messageEmbed = new Discord.RichEmbed()
					.setColor()
					.setTitle(normalMessage.author.username)
					.setDescription(normalMessage.content)
					.setThumbnail(normalMessage.author.avatarURL)
					.setTimestamp(normalMessage.createdAt)
					.addField('Message Link', `[Link](${normalMessage.url})`);

				if (normalMessage.attachments.array().length > 0) {
					normalMessage.attachments.forEach(attachment => {
						messageEmbed.setImage(attachment.url);
					});
				}

				pinChannel.send(messageEmbed);

				normalMessage.unpin();
			}
		})();
	},
};