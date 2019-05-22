const Keyv = require('keyv');
const lastRoll = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/lastroll.sqlite');
lastRoll.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'reroll',
	description: 'Rerolls certain values of the last roll',
	args: true,
	numerable: true,
	usage: '[reroll value]',
	execute(message, args) {
		(async () => {
			const rollArray = await lastRoll.get(message.guild.id);

			if (rollArray == null) {
				return message.channel.send(`You can not reroll when there is no last roll stored, ${message.author}`);
			}

			let total = 0;
			const target = parseInt(args[0]);
			const diceFaces = rollArray[rollArray.length - 1];

			for (let i = 0; i < rollArray.length - 1; i++) {
				if (rollArray[i] == target) {
					total++;
				}
			}

			if (total == 0) {
				return message.channel.send(`There are no matching values for the number provided, ${message.author}`);
			}

			// Messy

			const diceArray = [];
			let diceTemp;
			let diceTotal = 0;
			for (let i = 0; i < total; i++) {
				diceTemp = Math.floor((Math.random() * diceFaces) + 1);
				diceTotal += diceTemp;
				diceArray.push(diceTemp);
			}

			let diceIndividualString = '[';

			for (let i = 0; i < diceArray.length; i++) {
				if (i == diceArray.length - 1) {
					diceIndividualString = diceIndividualString + diceArray[i] + ']';
				}
				else {
					diceIndividualString = diceIndividualString + diceArray[i] + ', ';
				}
			}

			diceArray.push(diceFaces);
			await lastRoll.set(message.guild.id, diceArray);
			message.channel.send('Total: ' + diceTotal.toLocaleString() + '\nIndividual Rolls: ' + diceIndividualString);
		})();
	},
};