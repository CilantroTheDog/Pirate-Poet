const fs = require('fs');
const Discord = require('discord.js');
const { globalprefix, token } = require('./env.json');
const Keyv = require('keyv');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
prefixes.on('error', err => console.error('Keyv connection error:', err));

const blacklistRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/blacklistRoles.sqlite');
blacklistRoles.on('error', err => console.error('Keyv connection error:', err));

const storedRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/storedRoles.sqlite');
storedRoles.on('error', err => console.error('Keyv connection error:', err));

const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));

const channelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/channelRoles.sqlite');
channelStorage.on('error', err => console.error('Keyv connection error:', err));

const pinEmoteStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinEmote.sqlite');
pinEmoteStorage.on('error', err => console.error('Keyv connection error:', err));

const pinRetainEmoteStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/pinRetainEmote.sqlite');
pinRetainEmoteStorage.on('error', err => console.error('Keyv connection error:', err));

const infoPinStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/infoPins.sqlite');
infoPinStorage.on('error', err => console.error('Keyv connection error:', err));

const welcomeChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/welcomeChannel.sqlite');
welcomeChannelStorage.on('error', err => console.error('Keyv connection error:', err));

const exitChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/exitChannel.sqlite');
exitChannelStorage.on('error', err => console.error('Keyv connection error:', err));

const welcomeStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/welcomeMessage.sqlite');
welcomeStorage.on('error', err => console.error('Keyv connection error:', err));

const assignNamesStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignNames.sqlite');
assignNamesStorage.on('error', err => console.error('Keyv connection error:', err));

const exitStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/exitMessage.sqlite');
exitStorage.on('error', err => console.error('Keyv connection error:', err));

const joinRoleStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/joinRole.sqlite');
joinRoleStorage.on('error', err => console.error('Keyv connection error:', err));

const emojiRegex = /\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|(?:[\u0023\u002a\u0030-\u0039])\ufe0f?\u20e3|(?:(?:\ud83c\udfcb|\ud83d[\udd75\udd90]|[\u261d\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0]|\ud83e[\udd18-\udd1e\udd26\udd30\udd33-\udd39\udd3c-\udd3e]|[\u270a\u270b])(?:\ud83c[\udffb-\udfff]|)|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\udecc\uded0-\uded2\udeeb\udeec\udef4-\udef6]|\ud83e[\udd10-\udd17\udd20-\udd25\udd27\udd3a\udd40-\udd45\udd47-\udd4b\udd50-\udd5e\udd80-\udd91\uddc0]|[\u23e9-\u23ec\u23f0\u23f3\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a]|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcc-\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd74\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u00a9\u00ae\u203c\u2049\u2122\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2694\u2696\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f7\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))/g;
const customEmojiRegex = /^<:\w+:[0-9]+>$/;

client.once('ready', () => {
	(async () => {
		console.log('Ready to sail!');

		// Sets the bot"s game display message
		client.user.setPresence({ status: 'online', game: { name: 'on the unterzee', type: 0 } });

		client.guilds.forEach(guild => {
			const nameArray = await assignNamesStorage.get(guild.id);
		});

	})();
});

client.login(token);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Fires on message send in any channel
client.on('message', async message => {
	// Ignores message if message is sent by another bot or itself, or if it doesn't start with the prefix
	if (message.author.bot || message.content.startsWith('~~')) return;

	let prefix;

	if (!message.guild && message.content.startsWith(globalprefix)) {
		prefix = globalprefix;
	}
	else if (message.guild) {
		const guildPrefix = await prefixes.get(message.guild.id);
		if (message.content.startsWith(guildPrefix)) {
			prefix = guildPrefix;
		}
		else if (guildPrefix == null && message.content.startsWith(globalprefix)) {
			prefix = globalprefix;
		}
	}

	if (!prefix) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}`;

		if (command.usage) {
			reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (command.guildOnly && !message.guild) {
		return message.channel.send(`This is a server only command, ${message.author}`);
	}

	if (command.manageMessages && !message.member.hasPermission('MANAGE_MESSAGES')) {
		return message.channel.send(`This is an admin only command, ${message.author}`);
	}

	if (command.ownerOnly && message.author.id != 98909339263184896) {
		return message.channel.send(`This is a command only for testing, only the bot's owner can use it, ${message.author}`);
	}

	if (command.numerable) {
		for (const temp in args) {
			if (isNaN(temp)) {
				return message.channel.send(`One of your arguments is not a number, ${message.author}`);
			}
		}
	}

	if (command.manageRoles && !message.member.hasPermission('MANAGE_ROLES')) {
		return message.channel.send(`This is an admin only command, ${message.author}`);
	}

	if (command.blacklist) {
		const roleArray = await blacklistRoles.get(message.guild.id);

		if (roleArray != null) {
			for (let i = 0; i < roleArray.length; i++) {
				if (message.member.roles.some(role => role.name === roleArray[i])) {
					return message.channel.send(`You have a blacklisted role, you are not allowed to use this command, ${message.author}`);
				}
			}
		}
	}

	if (command.emojiOnly) {
		for (const temp in args) {
			console.log(args[temp]);
			if (!emojiRegex.test(args[temp])) {
				if (customEmojiRegex.test(args[temp])) {
					const parts = args[temp].split(/:/);
					parts[2] = parts[2].slice(0, parts[2].length - 1);
					if (!client.emojis.get(parts[2])) {
						return message.channel.send(`One of your arguments is not an emoji, ${message.author}`);
					}
					args.push(client);
				}
				else {
					return message.channel.send(`One of your arguments is not an emoji, ${message.author}`);
				}
			}
		}
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('Something unexpected happened. Ask Cilantro why!');
	}
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	const oldRoles = oldMember.roles.array();
	const newRoles = newMember.roles.array();
	const blacklistArray = await blacklistRoles.get(newMember.guild.id);
	let blacklist = false;

	const roleArray = await channelStorage.get(oldMember.guild.id);
	let storedArray = await storedRoles.get(newMember.guild.id + newMember.id);

	// This means a new role was added to a user
	if (blacklistArray != null && roleArray != null && oldMember.roles.size < newMember.roles.size) {
		let newRole;

		// Searchs to find the new role
		for (let i = 0; i < newRoles.length; i++) {
			for (let j = 0; j < oldRoles.length; j++) {
				if (oldRoles[j] == newRoles[i]) {
					break;
				}
				else if (j == oldRoles.length - 1) {
					newRole = newRoles[i];
				}
			}
		}

		// Checks to see if it was a blacklisted role
		for (let i = 0; i < blacklistArray.length; i++) {
			if (newRole.name == blacklistArray[i]) {
				blacklist = true;
			}
		}

		if (blacklist) {
			if (storedArray == null) {
				storedArray = [];
			}

			// Removes self assignable roles
			for (let i = 0; i < roleArray.length; i++) {
				if (newMember.roles.some(role => role.name === roleArray[i])) {
					const roleName = newMember.guild.roles.find(role => role.name === roleArray[i]);
					newMember.removeRole(roleName);
					storedArray.push(roleArray[i]);
				}
			}

			await storedRoles.set(newMember.guild.id + newMember.id, storedArray);
		}
	// This means a role was removed from a user
	}
	else if (oldMember.roles.size > newMember.roles.size && blacklistArray != null && storedArray != null) {
		let oldRole;

		// Searchs to find the removed role
		for (let i = 0; i < oldRoles.length; i++) {
			for (let j = 0; j < newRoles.length; j++) {
				if (oldRoles[i] == newRoles[j]) {
					break;
				}
				else if (j == newRoles.length - 1) {
					oldRole = oldRoles[i];
				}
			}
		}

		// Checks to see if it was a blacklist role
		for (let i = 0; i < blacklistArray.length; i++) {
			if (oldRole.name == blacklistArray[i]) {
				blacklist = true;
			}
		}

		if (blacklist) {
			// Adds self assignable roles again
			for (let i = 0; i < storedArray.length; i++) {
				const roleName = newMember.guild.roles.find(role => role.name === storedArray[i]);
				newMember.addRole(roleName);
			}

			await storedRoles.set(newMember.guild.id + newMember.id, null);
		}
	}
});

client.on('messageReactionAdd', async (messageReaction) => {
	const message = messageReaction.message;

	const pinEmojiObject = await pinEmoteStorage.get(message.guild.id);
	const retainEmojiObject = await pinRetainEmoteStorage.get(message.guild.id);
	let infoPinsArray = await infoPinStorage.get(message.guild.id);
	let shouldPin = false;

	if (infoPinsArray == null) {
		infoPinsArray = [];
	}

	if (pinEmojiObject != null) {
		if (pinEmojiObject.isCustom) {
			shouldPin = (message.reactions.find(reaction => reaction.emoji.id === pinEmojiObject.emoji.id) != null) ? true : false;

			if (shouldPin && message.pinned == false) {
				const emojiArray = message.reactions.array();
				for (let i = 0; i < emojiArray.length; i++) {
					if (emojiArray[i].emoji.id === pinEmojiObject.emoji.id && emojiArray[i].count > 2) {
						message.pin();
						break;
					}
				}
			}
		}
		else {
			shouldPin = (message.reactions.find(reaction => reaction.emoji.name === pinEmojiObject.emoji) != null) ? true : false;

			if (shouldPin && message.pinned == false) {
				const emojiArray = message.reactions.array();
				for (let i = 0; i < emojiArray.length; i++) {
					if (emojiArray[i].emoji.name === pinEmojiObject.emoji && emojiArray[i].count > 2) {
						message.pin();
						break;
					}
				}
			}
		}
	}

	if (retainEmojiObject != null) {
		if (retainEmojiObject.isCustom) {
			shouldPin = (message.reactions.find(reaction => reaction.emoji.id === retainEmojiObject.emoji.id) != null) ? true : false;

			if (shouldPin && message.pinned == false) {
				const emojiArray = message.reactions.array();
				for (let i = 0; i < emojiArray.length; i++) {
					if (emojiArray[i].emoji.id === retainEmojiObject.emoji.id && emojiArray[i].count > 2) {
						infoPinsArray.push(message.id);
						await infoPinStorage.set(message.guild.id, infoPinsArray);
						message.pin();
						break;
					}
				}
			}
		}
		else {
			shouldPin = (message.reactions.find(reaction => reaction.emoji.name === retainEmojiObject.emoji) != null) ? true : false;

			if (shouldPin && message.pinned == false) {
				const emojiArray = message.reactions.array();
				for (let i = 0; i < emojiArray.length; i++) {
					if (emojiArray[i].emoji.name === retainEmojiObject.emoji && emojiArray[i].count > 2) {
						infoPinsArray.push(message.id);
						await infoPinStorage.set(message.guild.id, infoPinsArray);
						message.pin();
						break;
					}
				}
			}
		}
	}
});

client.on('channelPinsUpdate', async channel => {
	if (!channel.guild) {
		return;
	}

	let is50 = false;
	const infoPinsArray = await infoPinStorage.get(channel.guild.id);
	const guildPrefix = await prefixes.get(channel.guild.id);

	if (infoPinsArray != null) {
		for (let i = 0; i < infoPinsArray.length; i++) {
			const pinnedMessage = await channel.fetchMessage(infoPinsArray[i]);

			if (pinnedMessage.pinned == false) {
				infoPinsArray.splice(i, 1);
				if (infoPinsArray.length == 0) {
					await infoPinStorage.set(channel.guild.id, null);
				}
				else {
					await infoPinStorage.set(channel.guild.id, infoPinsArray);
				}
			}
		}
	}

	channel.fetchPinnedMessages()
		.then(messages => {
			if (messages == null) {
				return;
			}
			else if (messages.size == 50) {
				is50 = true;
			}
		})
		.then(() => {
			if (!is50) {
				return;
			}

			const dummyMessage = new Discord.Message();

			dummyMessage.channel = channel;
			dummyMessage.guild = channel.guild;

			const prefix = guildPrefix ? guildPrefix : globalprefix;

			dummyMessage.content = `${prefix}pinvent 1`;

			const args = dummyMessage.content.slice(prefix.length).split(/ +/);
			const commandName = args.shift().toLowerCase();

			const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			command.execute(dummyMessage, args);
		});
});

client.on('guildMemberAdd', async guildMember => {
	const welcomeChannelName = await welcomeChannelStorage.get(guildMember.guild.id);
	const joinRoleName = await joinRoleStorage.get(guildMember.guild.id);

	if (welcomeChannelName == null) {
		return;
	}

	if (joinRoleName) {
		const joinRole = guildMember.guild.roles.find(role => role.name === joinRoleName);
		guildMember.addRole(joinRole);
	}

	let welcomeMessage = await welcomeStorage.get(guildMember.guild.id);
	const welcomeChannel = guildMember.guild.channels.find(channel => channel.name === welcomeChannelName);

	if (welcomeMessage == null) {
		return welcomeChannel.send(`Welcome ${guildMember.user} to ${guildMember.guild.name}, I hope you enjoy your stay!`);
	}
	else {
		welcomeMessage = welcomeMessage.replace(new RegExp('{user}', 'g'), guildMember.user);

		return welcomeChannel.send(welcomeMessage);
	}
});

client.on('guildMemberRemove', async guildMember => {
	const exitChannelName = await exitChannelStorage.get(guildMember.guild.id);

	if (exitChannelName == null) {
		return;
	}

	let exitMessage = await exitStorage.get(guildMember.guild.id);
	const exitChannel = guildMember.guild.channels.find(channel => channel.name === exitChannelName);

	if (exitMessage == null) {
		return exitChannel.send(`${guildMember.username} has left the server`);
	}
	else {
		exitMessage = exitMessage.replace(new RegExp('{user}', 'g'), guildMember.user);

		return exitChannel.send(exitMessage);
	}
});