const Keyv = require('keyv');
const joinRoleStorage = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/joinRole.sqlite');
joinRoleStorage.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'setuserjoinrole',
	description: 'Sets the role that is automatically assigned to the user when they join',
	usage: '[role]',
	args: true,
	guildOnly: true,
	manageMessages: true,
	manageRoles: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			let roleName = args[0];
			for (let i = 1; i < args.length; i++) {
				roleName = roleName + ' ' + args[i];
			}

			if (message.guild.roles.find(role => role.name === roleName) == null) {
				return message.channel.send(`Please make sure your role exists in this server, ${message.author}`);
			}

			await joinRoleStorage.set(message.guild.id, roleName);

			return message.channel.send(`The role ${roleName} has been set as the user join role, ${message.author}`);
		})();
	},
};