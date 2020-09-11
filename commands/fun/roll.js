module.exports = {
    name: 'roll',
    description: 'Rolls a random number from 0-100',
    return: false,
    run: async (client, message) => {
        message.channel.send(Math.floor(Math.random(101)));
    },
};