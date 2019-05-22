module.exports = {
	name: 'rate',
	description: 'Rates the user or the user\'s input',
	usage: '[reviewable object]',
	execute(message, args) {
		let rating = Math.floor((Math.random() * 11));

		// Super Rate :3
		if (Math.floor((Math.random() * 21)) == 20) {
			rating = 100;
		}

		if (!args.length) {
			return message.channel.send(`I rate ${message.author} a **${rating}/10**.`);
		}
		else {
			let object = args[0];
			for (let i = 1; i < args.length; i++) {
				object = object + ' ' + args[i];
			}

			return message.channel.send(`I rate ${object} a **${rating}/10**.`);
		}
	},
};