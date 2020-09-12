module.exports = {
    name: 'say',
    description: 'Repeats what the caller says',
    run: async (client, message, args) => {
        if(message.author.id == 176538779010596864) {
            const msg = args.join(' ');

            message.channel.send(msg);
            message.delete({ timeout: 100 });
        }
    },
};