const Keyv = require('keyv');
const blacklistRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/blacklistRoles.sqlite');
blacklistRoles.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'blacklist',
	description: 'Assigns a role to a blacklist, meaning users who have the role cannot subscribe to self assignable roles.',
	args: true,
	usage: '[role name]',
	guildOnly: true,
	manageRoles: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			let empty = false;
			let roleArray = await blacklistRoles.get(message.guild.id);

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
				await blacklistRoles.set(message.guild.id, roleArray);
				return message.channel.send(`The role ${roleName} has been added to the blacklist. Users with this role will no longer be able to subscribe to self assignable roles.`);
			}
		})();
	},
};