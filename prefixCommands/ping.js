module.exports.execute = async(client, message, args) => {
    const { author, guild, channel } = message;

    channel.send({ content: "pong!" })
},

module.exports.config = {
    name: "ping",
    description: "Bot'un ping paneline erişirsiniz.",
}