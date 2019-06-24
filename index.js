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

client.once('ready', () => {
	console.log('Ready to sail!');

	// Sets the bot"s game display message
	client.user.setPresence({ status: 'online', game: { name: 'on the unterzee', type: 0 } });
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

	const roleArray = await assignRoles.get(oldMember.guild.id);
	let storedArray = await storedRoles.get(newMember.guild.id + newMember.id);

	// This means a new role was added to a user
	if (blacklistArray != null && oldMember.roles.size < newMember.roles.size) {
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