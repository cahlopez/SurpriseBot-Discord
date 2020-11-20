const { Client, Collection } = require('discord.js');
const client = new Client();

// Collections
client.commands = new Collection();
client.aliases = new Collection();
const cooldowns = new Collection();

const { prefix, bot_info } = require('./config.json');

// Run the command loader
['command'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('ready', () => {
    console.log(bot_info.name + ' has started with version: ' + bot_info.version + ' and is now ready!');
    // client.users.resolve('237375045402361856').send("You're an idiot");

    // client.user.setPresence({
    //     status: 'online',
    //     activity: {
    //         name: 'BattLive develop me',
    //         type: 'WATCHING',
    //     },
    // });
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

    if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
    }

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    // If a command is finally found, run the command
    try {
        if(command) {
            console.log('Command called! ' + 'Caller: ' + msg.author.username + ' Command: ' + command.name);
            command.run(client, msg, args);
        }
    } catch(error) {
        console.log(error);
    }
});

client.login(process.env.BOT_TOKEN);