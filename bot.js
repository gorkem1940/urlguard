const {
  Client
} = require('discord.js');
const client = new Client();
const request = require('request');
const express = require('express')
let Options = {
  "Vanity_URL": "1940",
  "Log_Channel": "909499159386656788",
  "Bot_Token": "MTAxMTc2MTY1MDM2NzQ3OTkxOQ.G1uoji.FDl93gUuupLXRopVfc16RdGVDEARAoAtxmwOns"
};

client.on('guildUpdate', async (oldGuild, newGuild) => {
  if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
  let entry = await newGuild.fetchAuditLogs({
    type: 'GUILD_UPDATE'
  }).then(audit => audit.entries.first());
  if (!entry.executor || entry.executor.id === client.user.id) return;
  let channel = client.channels.cache.get(Options.Log_Channel);
  if (channel) channel.send(`${entry.executor} adlı kişi vanity url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`)
  if (!channel) newGuild.owner.send(`${entry.executor} adlı kişi vanity url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`)
  newGuild.members.ban(entry.executor.id, {
    reason: `${entry.executor.tag} adlı kişi vanity url'yi çalmaya çalıştığı için koruma tarafından banlandı.`
  });
  const settings = {
    url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
    body: {
      code: Options.Vanity_URL
    },
    json: true,
    method: 'PATCH',
    headers: {
      "Authorization": `Bot ${Options.Bot_Token}`
    }
  };
  request(settings, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
  });
});

client.login(Options.Bot_Token)
