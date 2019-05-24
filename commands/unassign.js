const Keyv = require('keyv');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
const assignNames = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignNames.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));
assignNames.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'unassign',
	description: 'Allows servers to make certain roles no longer self assignable.',
	usage: '[role name]',
	args: true,
	guildOnly: true,
	manageRoles: true,
	execute(message, args) {
		(async () => {
			const roleArray = await assignRoles.get(message.guild.id);
			const nameArray = await assignNames.get(message.guild.id);

			if (roleArray == null || nameArray == null) {
				return message.channel.send(`There are no roles to unassign, ${message.author}`);
			}

			let roleName = args[0];
			for (let i = 1; i < args.length; i++) {
				roleName = roleName + ' ' + args[i];
			}

			if (message.guild.roles.find(role => role.name === roleName) == null) {
				return message.channel.send(`Please make sure your role exists in this server, ${message.author}`);
			}

			let roleIndex = -1;

			for (let i = 0; i < roleArray.length; i++) {
				if (roleName == roleArray[i]) {
					roleIndex = i;
					break;
				}
			}

			if (roleIndex == -1) {
				return message.channel.send(`This role is already un-self assignable, ${message.author}`);
			}
			else {
				roleArray.splice(roleIndex, 1);
				nameArray.splice(roleIndex, 1);
				if (roleArray.length == 0 && nameArray.length == 0) {
					await assignRoles.set(message.guild.id, null);
					await assignNames.set(message.guild.id, null);
				}
				else {
					await assignRoles.set(message.guild.id, roleArray);
					await assignNames.set(message.guild.id, nameArray);
				}
				return message.channel.send(`The role ${roleName} is no longer self assignable, ${message.author}`);
			}
		})();
	},
};