const Keyv = require('keyv');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
const descriptionKeys = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/description.sqlite');

module.exports = {
	name: 'describe',
	description: 'Adds a description to a self assignable role',
	guildOnly: true,
	usage: '[description]',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			let empty = false;

			const roleArray = await assignRoles.get(message.guild.id);
			let descriptionArray = await descriptionKeys.get(message.guild.id);

			if (roleArray == null) {
				return message.channel.send(`There are no self assignable roles, ${message.author}`);
			}

			if (descriptionArray == null) {
				empty = true;
				descriptionArray = [];
			}

			let i = 1;
			let quotes = 0;
			let roleOnly = false;
			let description;

			for (let j = 0; j < args.length; j++) {
				for (let k = 0; k < args[j].length; k++) {
					if (args[j][k] == '"') {
						quotes++;
					}
				}
			}

			// Slightly messy?

			if (quotes == 2) {
				roleOnly = true;
			}
			else if (quotes != 4) {
				return message.channel.send(`Please make sure you type both the role and the description in quotation marks, ${message.author}`);
			}
			else if (args[0][0] != '"') {
				return message.channel.send(`Please make sure your role begins and ends with quotation marks, ${message.author}`);
			}
			else if (args[args.length - 1][args[args.length - 1].length - 1] != '"') {
				return message.channel.send(`Please make sure your description begins and ends with quotation marks, ${message.author}`);
			}

			let roleName = args[0].slice(1);

			if (args[0][args[0].length - 1] == '"') {
				roleName = roleName.slice(0, roleName.length - 1);
			}
			else {
				while (args[i] != null && args[i][args[i].length - 1] != '"') {
					roleName = roleName + ' ' + args[i];
					i++;
				}
				roleName = roleName + ' ' + args[i].slice(0, args[i].length - 1);
				i++;
			}

			if (message.guild.roles.find(role => role.name === roleName) == null) {
				return message.channel.send(`Please make sure your role exists in this server, ${message.author}`);
			}

			if (!roleOnly) {
				description = args[i].slice(1);

				if (args[i][args[i].length - 1] == '"') {
					description = description.slice(0, description.length - 1);
				}
				else {
					i++;
					while (args[i] != null && args[i][args[i].length - 1] != '"') {
						description = description + ' ' + args[i];
						i++;
					}
					description = description + ' ' + args[i].slice(0, args[i].length - 1);
				}
			}

			let descriptionIndex = -1;

			if (!empty) {
				for (i = 0; i < descriptionArray.length; i++) {
					if (roleName == descriptionArray[i][0]) {
						descriptionIndex = i;
						break;
					}
				}
			}

			if (descriptionIndex == -1) {
				if (roleOnly) {
					return message.channel.send(`The role ${roleName} already doesn't have a description, please put the description if you wish to add one.`);
				}
				else {
					const newDescription = [];
					newDescription.push(roleName);
					newDescription.push(description);
					descriptionArray.push(newDescription);
					await descriptionKeys.set(message.guild.id, descriptionArray);
					return message.channel.send(`The role ${roleName} has had the new description set.`);
				}
			}
			else if (roleOnly) {
				descriptionArray.splice(descriptionIndex, 1);
				if (descriptionArray.length) {
					await descriptionKeys.set(message.guild.id, null);
				}
				else {
					await descriptionKeys.set(message.guild.id, descriptionArray);
				}
				return message.channel.send(`The role ${roleName} no longer has a description, ${message.author}`);
			}
			else {
				descriptionArray[descriptionIndex][1] = description;
				await descriptionKeys.set(message.guild.id, descriptionArray);
				return message.channel.send(`The role ${roleName} has changed its description.`);
			}
		})();
	},
};