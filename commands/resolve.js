const Keyv = require('keyv');
const resolveChannelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/resolveChannel.sqlite');
resolveChannelStorage.on('error', err => console.error('Keyv connection error:', err));
const resolveUsersStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/resolveUsers.sqlite');
resolveUsersStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'resolve',
	description: '?',
	guildOnly: true,
	args: true,
	hidden: true,
	manageRoles: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			if (message.guild.members.find(member => member.user.tag === args[0]) == null) {
				return message.channel.send(`Please make sure your user exists in this server, ${message.author}`);
			}

			const resolveChannelName = await resolveChannelStorage.get(message.guild.id);

			if (resolveChannelName == null) {
				return message.channel.send(`Please make sure you set a channel to put users in, using the setresolvechannel command, ${message.author}`);
			}

			let empty = false;
			let resolveUserArray = await resolveUsersStorage.get(message.guild.id);
			let remove = false;
			let i;
			let existingUserIndex = -1;

			const removePermissions = {
				'SEND_MESSAGES': false,
				'READ_MESSAGES': false,
			};

			const addPermissions = {
				'SEND_MESSAGES': true,
				'READ_MESSAGES': true,
			};

			if (resolveUserArray == null) {
				empty = true;
				resolveUserArray = [];
			}

			const user = message.guild.members.find(member => member.user.tag === args[0]);

			if (!empty) {
				for (i in resolveUserArray) {
					if (user.tag == resolveUserArray[i]) {
						remove = true;
						existingUserIndex = i;
						break;
					}
				}
			}

			const channelArray = message.guild.channels.array();
			const resolveChannel = message.guild.channels.find(channel => channel.name === resolveChannelName);

			if (!remove) {
				for (i in channelArray) {
					if (channelArray[i] == resolveChannel) {
						channelArray[i].overwritePermissions(user, addPermissions);
					}
					else {
						channelArray[i].overwritePermissions(user, removePermissions);
					}
				}

				resolveUserArray.push(user.tag);
				await resolveUsersStorage.set(message.guild.id, resolveUserArray);
				return message.channel.send(`The user ${args[0]} has been added to the issue resolve channel`);
			}
			else {
				for (i in channelArray) {
					if (channelArray[i] == resolveChannel) {
						channelArray[i].overwritePermissions(user, removePermissions);
					}
					else {
						channelArray[i].overwritePermissions(user, addPermissions);
					}
				}

				resolveUserArray.splice(existingUserIndex, 1);
				if (resolveUserArray.length == 0) {
					await resolveUsersStorage.set(message.guild.id, null);
				}
				else {
					await resolveUsersStorage.set(message.guild.id, resolveUserArray);
				}
				return message.channel.send(`The user ${args[0]} has been removed from the issue resolve channel`);
			}
		})();
	},
};