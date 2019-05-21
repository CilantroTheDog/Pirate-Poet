const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./env.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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
client.on('message', message => {
	// Ignores message if message is sent by another bot or itself, or if it doesn't start with the prefix
	if (message.author.bot || !message.content.startsWith(prefix) || message.content.startsWith('~~')) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('Error: Command not recognized');
	}
});


/*
if (args[0] == '') {
			message.channel.send(`\`\`\`fix\nCommands: Type help <command> for more info!\n\nPing - Displays the amount of time it takes the bot to recieve your message and send a response\nRoll - Rolls dice under specific parameters\nPrefix - Changes the prefix for each command\n\`\`\``);
		}
		else if (args[0] == 'ping') {
			message.channel.send(`\`\`\`fix\nPing - Arguments Allowed: 0\n\nDescription: Calculates the time it takes for your message to be recieved by discord and seen by the bot. Due to how discord handles message timing, the time recieved may be negative, resulting in an innaccurate reading.\n\`\`\``);
		}
		else if (args[0] == 'roll') {
			message.channel.send(`\`\`\`fix\nRoll - Arguments Allowed: 2\n\nArgument 1: Faces - Specifies the number of faces the dice has. The maximum is 99,999 faces.\nArgument 2: Number (Optional) - Specifies the number of dice to roll at once, with the specified number of faces. Each dice's result will be displayed, as well as the sum of all of them. The maximum amount of dice to roll is 99,999.\n\nDescription: The roll command is used to simulate rolling a dice, useful for tabletop roleplaying. For information on rerolling certain values, please see the reroll command.\n\`\`\``);
		}
		else if (args[0] == 'reroll') {
			message.channel.send(`\`\`\`fix\nReroll - Arguments Allowed: 1 or more\n\nArgument 1: Digit Reroll Value - Specifies the dice to reroll if it has this value. Unlimited amount of arguments of this type can be given, as long as the previous roll command had it as a possible result value.\n\nDescription: The reroll command can only be used after a roll command is used. When called, it will reroll any dice that has a certain face value equal to the arguments of this command. For information on rolling values, please see the roll command.\n\`\`\``);
		}
		else if (args[0] == 'prefix') {
			message.channel.send(`\`\`\`fix\nPrefix - Arguments Allowed: 1\n\nArgument 1: Prefix - Specifies the prefix the bot will use when executing a command\n\nDescription: This command changes the prefix the bot uses for every command. Can only be used by users with the "Manage Messages" permission.\n\`\`\``);
		}
*/