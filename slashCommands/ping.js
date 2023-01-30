module.exports.execute = async(client, interaction) => {
    interaction.reply({ content: "hello" })
},

module.exports.config = {
    name: "ping",
    description: "Bot'un gecikmesini gösterir.",
    options: []
}