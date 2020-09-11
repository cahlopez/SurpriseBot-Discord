module.exports = {
    name: 'purge',
    description: 'Purges messages in chat',
    return: false,
    run: async (client, msg, args) => {
        // Check if the user has permissions to use the command
        if(!msg.member.roles.cache.some(r=>['Operator', 'Administrator'].includes(r.name))) {
            msg.delete({ timeout: 3000 });
            return msg.reply('Sorry, you don\'t have permissions to use this!')
                .then(rplymsg => {
                    rplymsg.delete({ timeout: 3000 });
                });
        }

        // Get the delete count, as an actual number.
        const deleteCount = parseInt(args[0] + 1, 10);

        // Set a min and max for deleteCount
        if(!deleteCount || deleteCount < 2 || deleteCount > 100) {
            msg.delete({ timeout: 3000 });
            return msg.reply('please provide a number between 2 and 100 for the number of messages to delete.')
                .then(rplymsg => {
                    rplymsg.delete({ timeout: 3000 });
                });
        }

        // Delete purge message
        msg.delete();

        // Get the messages and delete them
        const fetched = await msg.channel.messages.fetch({ limit: deleteCount });
        msg.channel.bulkDelete(fetched)
            .catch(error => msg.reply(`Couldn't delete messages because of: ${error}`));

        msg.channel.send(fetched.size + ` messages have been purged!, ${msg.author}!`)
            .then(delmsg => {
                delmsg.delete({ timeout: 3000 });
            });
    },
};