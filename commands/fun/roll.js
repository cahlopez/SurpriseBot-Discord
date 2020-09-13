module.exports = {
    name: 'roll',
    description: 'Rolls a random number from 0-100',
    run: async (client, message, args) => {
        if(message.author.id == 272865436847308800 && args[0] != null) {
            message.channel.send(message.author.username + ' rolled: ' + args[0]);
        } else {
            message.channel.send(message.author.username + ' rolled: ' + Math.floor(Math.random() * 101));
        }
        message.delete({ timeout: 100 });
    },
};