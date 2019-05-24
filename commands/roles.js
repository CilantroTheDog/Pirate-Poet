const Keyv = require('keyv');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
const assignNames = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignNames.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));
assignNames.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'roles',
	description: 'Displays all the self assignable roles for the server',
	guildOnly: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			const roleArray = await assignRoles.get(message.guild.id);
			const nameArray = await assignNames.get(message.guild.id);

			if (roleArray == null || nameArray == null) {
				return message.channel.send(`There are no roles to subscribe to, ${message.author}`);
			}

			let roleString = '```fix';

			for (let i = 0; i < roleArray.length; i++) {
				roleString = roleString + '\n' + roleArray[i] + ' | ' + nameArray[i];
			}

			roleString = roleString + '\n```';

			return message.channel.send(`The roles for this server can be found below. The first name in a row is the role, while the second name is the command you can use to recieve that role.\n` + roleString);
		})();
	},
};