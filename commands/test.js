module.exports = {
	name: 'test',
	description: 'Used to test new features, bot owner only command',
	ownerOnly: true,
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		(async () => {
			const pinnedMessageArray = [];
			message.channel.fetchPinnedMessages()
				.then(messages => {
					messages.forEach(pinMessage => {
						console.log(pinnedMessageArray.length);
						pinnedMessageArray.push(pinMessage);
					});
				})
				.then(i => {
					console.log(pinnedMessageArray.length);

					for (i = 0; i < pinnedMessageArray.length; i++) {
						message.channel.send(pinnedMessageArray[i].content);
					}

					let minIndex;
					let firstMessageDate;
					let secondMessageDate;
					let temp;
					for (i = 0; i < pinnedMessageArray.length - 2; i++) {
						minIndex = i;
						for (let j = 1; j < pinnedMessageArray.length - 1; j++) {
							firstMessageDate = pinnedMessageArray[j].createdAt;
							secondMessageDate = pinnedMessageArray[minIndex].createdAt;
							if (firstMessageDate.getTime() < secondMessageDate.getTime()) {
								minIndex = j;
							}
						}
						temp = pinnedMessageArray[i];
						pinnedMessageArray[i] = pinnedMessageArray[minIndex];
						pinnedMessageArray[minIndex] = temp;
					}

					for (i = 0; i < pinnedMessageArray.length; i++) {
						message.channel.send(pinnedMessageArray[i].content);
					}
				});
		})();
	},
};