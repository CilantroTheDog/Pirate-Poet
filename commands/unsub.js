const Keyv = require('keyv');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
const assignNames = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignNames.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));
assignNames.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'unsub',
	description: 'Allows users to remove a role from them on a server',
	usage: '[command name]',
	args: true,
	guildOnly: true,
	blacklist: true,
	execute(message, args) {
		(async () => {
			const roleArray = await assignRoles.get(message.guild.id);
			const nameArray = await assignNames.get(message.guild.id);

			if (roleArray == null || nameArray == null) {
				return message.channel.send(`There are no roles to unsubscribe to, ${message.author}`);
			}

			let command = args[0];
			for (let i = 1; i < args.length; i++) {
				command = command + ' ' + args[i];
			}

			let commandIndex = -1;

			for (let i = 0; i < nameArray.length; i++) {
				if (command == nameArray[i]) {
					commandIndex = i;
					break;
				}
			}

			if (commandIndex == -1) {
				return message.channel.send(`The role you are trying to unsubscribe to could not be found, ${message.author}`);
			}
			else if (!message.member.roles.some(role => role.name === roleArray[commandIndex])) {
				return message.channel.send(`You already don't have this role, ${message.author}`);
			}
			else {
				const roleName = message.guild.roles.find(role => role.name === roleArray[commandIndex]);
				message.member.removeRole(roleName);
				return message.channel.send(`You now no longer have the ${roleArray[commandIndex]} role, ${message.author}`);
			}
		})();
	},
};