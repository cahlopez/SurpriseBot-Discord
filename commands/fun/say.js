module.exports = {
    name: 'roll',
    description: 'Rolls a random number from 0-100',
    run: async (client, message, args) => {
        const msg = args.join(' ');

        message.channel.send(msg);
        message.delete({ timeout: 100 });
    },
};