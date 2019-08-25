const Discord = require('discord.js');
const Keyv = require('keyv');
const globalprefix = '~';
const pinChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinChannel.sqlite');
pinChannelStorage.on('error', err => console.error('Keyv connection error:', err));

const pinRetainEmoteStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinRetainEmote.sqlite');
pinRetainEmoteStorage.on('error', err => console.error('Keyv connection error:', err));

const infoPinStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/infoPins.sqlite');
infoPinStorage.on('error', err => console.error('Keyv connection error:', err));

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
			const infoPinsArray = await infoPinStorage.get(message.guild.id);
			const pinnedMessageArray = [];

			let i, j, pinnedMessage, startIndex;
			let noSkip = false;
			let recurse = false;

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

				if (pinRetainEmojiObject != null && infoPinsArray != null) {
					for (j = 0; j < infoPinsArray.length; j++) {
						const differentMessage = await pinnedMessage.channel.fetchMessage(infoPinsArray[j]);

						if (differentMessage.id == pinnedMessage.id) {
							recurse = true;
						}
					}

					if (recurse) {
						const dummyMessage = new Discord.Message();

						dummyMessage.channel = pinnedMessage.channel;
						dummyMessage.guild = pinnedMessage.channel.guild;

						const prefix = guildPrefix ? guildPrefix : globalprefix;

						dummyMessage.content = `${prefix}pinvent ${startIndex - endIndex} 1`;

						const args2 = dummyMessage.content.slice(prefix.length).split(/ +/);
						args2.shift().toLowerCase();

						return module.exports.execute(dummyMessage, args2);
					}
				}

				const messageEmbed = new Discord.RichEmbed()
					.setColor()
					.setTitle(pinnedMessage.author.username)
					.setDescription(pinnedMessage.content)
					.setThumbnail(pinnedMessage.author.avatarURL)
					.setTimestamp(pinnedMessage.createdAt)
					.addField('Message Link', `[Link](${pinnedMessage.url})`);

				if (pinnedMessage.attachments.array().length > 0) {
					pinnedMessage.attachments.forEach(attachment => {
						messageEmbed.setImage(attachment.url);
					});
				}

				pinChannel.send(messageEmbed);

				pinnedMessage.unpin();
			}
		})();
	},
};