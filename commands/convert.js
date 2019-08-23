module.exports = {
	name: 'convert',
	description: 'Converts measurements between Imperial and Metric',
	usage: '[measurement] [measurement type]',
	args: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			if (args.length != 2) {
				return message.channel.send(`Please make sure you have only a number as well as it's measurement type, ${message.author}`);
			}

			if (isNaN(args[0])) {
				return message.channel.send(`Your first measurement is not a number, ${message.author}`);
			}

			args[1] = args[1].toLowerCase();

			if (args[1] == 'c' || args[1] == 'celcius') {
				return message.channel.send(`${(Math.floor(args[0] * (9 / 5)) + 32)} degrees Fahrenheit`);
			}
			else if (args[1] == 'f' || args[1] == 'fahrenheit') {
				return message.channel.send(`${(Math.floor(args[0] - 32) * (5 / 9))} degrees Celcius`);
			}
			else if (args[1] == 'in' || args[1] == 'inches') {
				return message.channel.send(`${Math.floor(args[0] * 2.54)} centimeters`);
			}
			else if (args[1] == 'cm' || args[1] == 'centimeters' || args[1] == 'centimetres') {
				return message.channel.send(`${Math.floor(args[0] * 0.394)} inches`);
			}
			else if (args[1] == 'mi' || args[1] == 'miles') {
				return message.channel.send(`${Math.floor(args[0] * 1.609)} kilometers`);
			}
			else if (args[1] == 'km' || args[1] == 'kilometers' || args[1] == 'kilometres') {
				return message.channel.send(`${Math.floor(args[0] * 0.621)} miles`);
			}
			else if (args[1] == 'lb' || args[1] == 'lbs' || args[1] == 'pounds') {
				return message.channel.send(`${Math.floor(args[0] * 0.453)} kilograms`);
			}
			else if (args[1] == 'kg' || args[1] == 'kilograms') {
				return message.channel.send(`${Math.floor(args[0] * 2.204)} pounds`);
			}
			else {
				return message.channel.send(`Your measurement isn't recognized', ${message.author}`);
			}
		})();
	},
};