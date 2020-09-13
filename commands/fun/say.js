module.exports = {
    name: 'say',
    description: 'Repeats what the caller says',
    run: async (client, message, args) => {
        const whitelist = [176538779010596864, 272865436847308800];

        if(whitelist.indexOf(message.author.id) != -1) {
            const msg = args.join(' ');

            message.channel.send(msg);
            message.delete({ timeout: 100 });
        } else {
            message.channel.send('<@' + message.author.id + '>' + ' is really dumb!');
            message.delete({ timeout: 100 });
        }
    },
};