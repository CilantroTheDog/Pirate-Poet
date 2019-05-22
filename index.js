const fs = require('fs');
const Discord = require('discord.js');
const { globalprefix, token } = require('./env.json');
const Keyv = require('keyv');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const prefixes = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/prefix.sqlite');
prefixes.on('error', err => console.error('Keyv connection error:', err));

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

	if (message.guild && command.manageMessages && !message.member.hasPermission('MANAGE_MESSAGES')) {
		return message.channel.send(`This is an admin only command, ${message.author}`);
	}

	if (command.numerable) {
		for (const temp in args) {
			if (isNaN(temp)) {
				return message.channel.send(`One of your arguments is not a number, ${message.author}`);
			}
		}
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('Something strange happened. Ask Cilantro why!');
	}
});