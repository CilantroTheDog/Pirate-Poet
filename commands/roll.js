const Keyv = require('keyv');
const lastRoll = new Keyv('sqlite://C:/Users/Administrator/Desktop/Pirate_Poet/Database/lastroll.sqlite');
lastRoll.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	name: 'roll',
	description: 'Rolls a certain amount of dice with a certain amount of faces',
	args: true,
	usage: '<dice>',
	numerable: true,
	aliases: ['r'],
	execute(message, args) {
		(async () => {
			let diceAmount = 1;
			let diceFaces = 0;
			let diceTotal = 0;

			const diceArgs = args[0].trim().split(/d/g);

			// Lazy Spaghetti
			args[0] = diceArgs[1];
			args[1] = diceArgs[0];

			diceFaces = parseInt(args[0]);
			if (args[1] != '') {
				diceAmount = parseInt(args[1]);
			}

			if (diceAmount <= 0 || diceFaces <= 0) {
				message.channel.send('Error: One or multiple arguments are non-positive numbers');
				return;
			}
			else if (diceAmount >= 100000 || diceFaces >= 100000) {
				message.channel.send('Please only use values less than 100,000.');
				return;
			}

			const diceArray = [];
			let diceTemp;
			for (let i = 0; i < diceAmount; i++) {
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