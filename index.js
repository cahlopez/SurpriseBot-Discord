const { Client, Collection, Guild } = require('discord.js');
const client = new Client();

// Collections
client.commands = new Collection();
client.aliases = new Collection();

const { prefix, bot_info } = require('./config.json');

// Run the command loader
['command'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('ready', () => {
    console.log(bot_info.name + ' has started with version: ' + bot_info.version + ' and is now ready!');
    // client.users.resolve('331888945342185473').send('Happy Birthday Alex, you can redeem the following codes on League: RA-LF68BP6HQW25D7L5 | RA-BXG9KU9EZJFC354T');

    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'BattLive develop me',
            type: 'WATCHING',
        },
    });
});

client.on('message', async msg => {
    if(!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if(command) {
        command.run(client, msg, args);
    }
});

client.login('NzQxNDkyNTA0NjgzMjE2OTM2.Xy4WtQ.GZMWnQA6iLQoOJHUHv1MekQJGAA');