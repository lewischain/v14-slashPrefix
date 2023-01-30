module.exports.execute = async(client, interaction) => {
   if(interaction.isChatInputCommand()) {

    const command = client.slashCommands.get(interaction.commandName);

    if(!command) {
        return console.error(`${interaction.commandName} --> Böyle bir komutum yok.`)
    }

    await command.execute(client, interaction);
   }
}

module.exports.config = {
    name: "interactionCreate",
    once: false
}