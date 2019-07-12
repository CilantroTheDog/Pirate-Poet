const Keyv = require('keyv');
const channelStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/channelRoles.sqlite');
channelStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'channelify',
	description: 'Makes a assignable role a channel role, meaning it is removed when a user recieves a blacklist role.',
	usage: '[role name]',
	args: true,
	guildOnly: true,
	manageRoles: true,
	execute(message, args) {
		(async () => {
			let empty = false;
			let roleArray = await channelStorage.get(message.guild.id);

			if (roleArray == null) {
				empty = true;
				roleArray = [];
			}

			let roleName = args[0];
			for (let i = 1; i < args.length; i++) {
				roleName = roleName + ' ' + args[i];
			}

			if (message.guild.roles.find(role => role.name === roleName) == null) {
				return message.channel.send(`Please make sure your role exists in this server, ${message.author}`);
			}

			let roleIndex = -1;

			if (!empty) {
				for (let i = 0; i < roleArray.length - 1; i++) {
					if (roleName == roleArray[i]) {
						roleIndex = i;
						break;
					}
				}
			}

			if (roleIndex == -1) {
				roleArray.push(roleName);
				await channelStorage.set(message.guild.id, roleArray);
				return message.channel.send(`The role ${roleName} has been made a channel role. Users with a channel role will have it removed when they recieve a blacklist role.`);
			}
			else {
				roleArray.splice(roleIndex, 1);
				if (roleArray.length == 0) {
					await channelStorage.set(message.guild.id, null);
				}
				else {
					await channelStorage.set(message.guild.id, roleArray);
				}
				return message.channel.send(`The role ${roleName} is no longer a channel role, ${message.author}`);
			}
		})();
	},
};