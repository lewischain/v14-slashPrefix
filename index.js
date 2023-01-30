require('advanced-logs');
require("dotenv");

console.setConfig({
    background: true,
    timestamp: false
}); 

const fs = require("fs");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember
    ],
    allowedMentions: {
        parse: [
            "everyone",
            "roles",
            "users"
        ]
    },
});

client.slashCommands = new Collection();
client.registerdCommands = new Collection();
client.prefixCommands = new Collection();

const config = require("./config");

const loadingCommands = () => {
    for(const command of fs.readdirSync("./prefixCommands").filter(file => file.endsWith(".js"))) {
        const cmd = require(`./prefixCommands/${command}`);
    
        client.prefixCommands.set(cmd.config.name, cmd);
        console.success(`${cmd.config.name} komutu başarıyla aktif edildi. (prefix)`)
    }

    for(const command of fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"))) {
        const cmd = require(`./slashCommands/${command}`);
    
        client.slashCommands.set(cmd.config.name, cmd)
        client.registerdCommands.set(cmd.config.name, cmd.config)
        console.success(`${cmd.config.name} komutu başarıyla aktif edildi. (slash)`)
    }
}

const loadingEvents = () => {
    for(const event of fs.readdirSync("./events").filter(file => file.endsWith(".js"))) {
        const evt = require(`./events/${event}`);

        if(evt.config.once) {
            client.once(evt.config.name, (...args) => {
                evt.execute(client, ...args)
            }); 
        } else {
            client.on(evt.config.name, (...args) => {
                evt.execute(client, ...args)
            }); 
        }
    }
}

const slashCommandsRegister = () => {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v10");

    client.once("ready", async() => {
        const rest = new REST({ version: "10" }).setToken(config.client.token);
      try {
        await rest.put(Routes.applicationCommands(config.client.id), {
          body: client.registerdCommands,
        }).then(() => {
            console.info(`Kayıt edilen komut sayısı: ${client.registerdCommands.size}`)
        });
      } catch (error) {
        throw error;
      }
    });
} 

loadingCommands();
loadingEvents();
slashCommandsRegister();

client.login(config.client.token).then(() => {
    console.success(`${client.user.tag} başarılı bir şekilde bağlandı.`);
}).catch((err) => {
    console.error(`${client.user.tag} bağlanamadı. Hata: ${err}`);
});