const { prefixCommands } = require("../config");

module.exports.execute = async(client, message) => {
    if(message.author.bot) return;
    if(!message.guild) return;

    if(!message.content.startsWith(prefixCommands.prefix)) return;
    const args = message.content.slice(prefixCommands.prefix.length).trim().split(/ +/g);

    const command = client.prefixCommands.get(args.shift().toLowerCase());

    if(command) {
        return command.execute(client, message, args);
    }
}

module.exports.config = {
    name: "messageCreate",
    once: false
}