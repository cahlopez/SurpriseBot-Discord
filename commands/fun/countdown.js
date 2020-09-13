module.exports = {
    name: 'countdown',
    description: 'Counts down from certain number',
    run: async (client, message, args) => {
        const whitelist = ['176538779010596864', '272865436847308800'];
        const timer = args[0];

        args.splice(0, 1);
        const userMsg = args.join(' ');

        const msg = await message.channel.send('You have ' + timer + ' seconds to ' + userMsg);
        message.delete({ timeout: 100 });

        if(whitelist.indexOf(message.author.id) != -1) {
            countdownFunc(timer, msg, userMsg);
        }
    },
};

function countdownFunc(timer, msg, userMsg) {
    if(timer > -1) {
        msg.edit('You have ' + timer + ' seconds to' + userMsg);

        setTimeout(function() {
            countdownFunc(timer - 1, msg, userMsg);
        }, 1000);
    }
}