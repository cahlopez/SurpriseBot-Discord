module.exports = {
    name: 'roll',
    description: 'Rolls a random number from 0-100',
    run: async (client, message) => {
        message.channel.send(message.author.username + ' rolled: ' + Math.floor(Math.random() * 101));
    },
};