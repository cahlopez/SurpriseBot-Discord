module.exports = {
    name: 'survey',
    cooldown: 3,
    description: 'Returns latency and API ping',
    run: async (client, message, args) => {
        message.delete();

        message.channel.send(args[0]);
    },
};