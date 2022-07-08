module.exports = {
    name: 'mute',
    description: 'Mute people in chat',
    run: async (client, msg, args) => {
        // Check if the user has permissions to use the command
        if(!msg.member.roles.cache.some(r=>['High Council'].includes(r.name))) {
            msg.delete({ timeout: 3000 });
            return msg.reply('Sorry, you don\'t have permissions to use this!')
                .then(rplymsg => {
                    rplymsg.delete({ timeout: 3000 });
                });
        }

        return args[0];
    },
};