const Keyv = require('keyv');
const { globalprefix } = require('./../env.json');
const assignRoles = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignRoles.sqlite');
const assignNames = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/assignNames.sqlite');
const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
assignRoles.on('error', err => console.error('Keyv connection error:', err));
assignNames.on('error', err => console.error('Keyv connection error:', err));
prefixes.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'assign',
	description: 'Allows servers to make certain roles self assignable.',
	usage: '"[role name]" "[role alias (Optional)]"',
	args: true,
	guildOnly: true,
	manageRoles: true,
	execute(message, args) {
		(async () => {
			let prefix;
			let empty = false;

			const guildPrefix = await prefixes.get(message.guild.id);

			if (guildPrefix != null && guildPrefix != globalprefix) {
				prefix = guildPrefix;
			}
			else {
				prefix = globalprefix;
			}

			let roleArray = await assignRoles.get(message.guild.id);
			let nameArray = await assignNames.get(message.guild.id);

			if (roleArray == null || nameArray == null) {
				empty = true;
				roleArray = [];
				nameArray = [];
			}

			let i = 1;
			let quotes = 0;
			let roleOnly = false;
			let command;

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
				return message.channel.send(`Please make sure you type each command in quotation marks, ${message.author}`);
			}
			else if (args[0][0] != '"') {
				return message.channel.send(`Please make sure your role begins and ends with quotation marks, ${message.author}`);
			}
			else if (args[args.length - 1][args[args.length - 1].length - 1] != '"') {
				return message.channel.send(`Please make sure your role alias begins and ends with quotation marks, ${message.author}`);
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
				command = args[i].slice(1);

				if (args[i][args[i].length - 1] == '"') {
					command = command.slice(0, command.length - 1);
				}
				else {
					i++;
					while (args[i][args[i].length - 1] == '"') {
						command = command + ' ' + args[i];
						i++;
					}
					command = command + ' ' + args[i].slice(0, args[i].length - 1);
					i++;
				}
			}

			let roleIndex = -1;

			if (!empty) {
				for (i = 0; i < roleArray.length; i++) {
					if (roleName == roleArray[i]) {
						roleIndex = i;
						break;
					}
				}
			}

			if (roleIndex == -1) {
				if (roleOnly) {
					roleArray.push(roleName);
					nameArray.push(roleName);
					await assignRoles.set(message.guild.id, roleArray);
					await assignNames.set(message.guild.id, nameArray);
					return message.channel.send(`The role ${roleName} has been made self assignable. You can recieve it by typing \`${prefix}sub ${roleName}\`, or remove it by typing \`${prefix}unsub ${roleName}\`.`);
				}
				else {
					roleArray.push(roleName);
					nameArray.push(command);
					await assignRoles.set(message.guild.id, roleArray);
					await assignNames.set(message.guild.id, nameArray);
					return message.channel.send(`The role ${roleName} has been made self assignable. You can recieve it by typing \`${prefix}sub ${command}\`, or remove it by typing \`${prefix}unsub ${command}\`.`);
				}
			}
			else if (roleOnly) {
				if (roleArray[roleIndex] != nameArray[roleIndex]) {
					nameArray[roleIndex] = roleName;
					await assignNames.set(message.guild.id, nameArray);
					return message.channel.send(`The role ${roleName} has changed its command to recieve and remove it. You can now recieve it by typing \`${prefix}sub ${roleName}\`, or remove it by typing \`${prefix}unsub ${roleName}\`.`);
				}
				else {
					return message.channel.send(`The role ${roleName} has not changed the command to assign it because no command was provided. Please provide a new command if you wish to change it.`);
				}
			}
			else {
				nameArray[roleIndex] = command;
				await assignNames.set(message.guild.id, nameArray);
				return message.channel.send(`The role ${roleName} has changed its command to recieve and remove it. You can now recieve it by typing \`${prefix}sub ${command}\`, or remove it by typing \`${prefix}unsub ${command}\`.`);
			}
		})();
	},
};