module.exports = {
    name: 'say',
    description: 'Repeats what the caller says',
    run: async (client, message, args) => {
        const msg = args.join(' ');

        message.channel.send(msg);
        message.delete({ timeout: 100 });
    },
};