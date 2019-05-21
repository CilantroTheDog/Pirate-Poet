module.exports = {
	name: 'roll',
	description: 'Rolls a certain amount of dice with a certain amount of faces',
	args: true,
	usage: '<dice faces> <dice amount>',
	execute(message, args) {
		let diceAmount = 1;
		let diceFaces = 0;
		let diceTotal = 0;

		try {
			if (isNaN(args[0])) {
				throw 'Dice1';
			}
			else {
				diceFaces = parseInt(args[0]);
			}
			if (args[1] != null) {
				if (isNaN(args[1])) {
					throw 'Dice2';
				}
				else {
					diceAmount = parseInt(args[1]);
				}
			}
		}
		catch (err) {
			if (err === 'Dice1') {
				message.channel.send('Error: Argument for number of dice faces is not a valid number');
			}
			else if (err == 'Dice2') {
				message.channel.send('Error: Argument for number of dice is not a valid number');
			}
			return;
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

		message.channel.send('Total: ' + diceTotal.toLocaleString() + '\nIndividual Rolls: ' + diceIndividualString);
	},
};