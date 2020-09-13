module.exports = {
    name: 'roll',
    description: 'Rolls a random number from 0-100',
    run: async (client, message, args) => {
        const whitelist = [176538779010596864, 272865436847308800];

        if(whitelist.indexOf(message.author.id) != -1 && args[0] != null) {
            message.channel.send(message.author.username + ' rolled: ' + args[0]);
        } else {
            message.channel.send(message.author.username + ' rolled: ' + Math.floor(Math.random() * 101));
        }
        message.delete({ timeout: 100 });
    },
};