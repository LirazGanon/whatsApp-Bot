const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(98303) });

const prefix = "?";

client.on("ready", () => {
  console.log("im online");
});

client.on("messageCreate", async (msg) => {
  if (msg.content.startsWith(prefix)) {
    msg.channel.send("command detected");
    //msg.channel.permissionOverwrites.edit("1010988976066265329", { SEND_MESSAGES: false }).then(() => msg.channel.send("success"));

    // const general = await msg.guild.channels.cache.get("987667090611789846");
    // general.permissionOverwrites.edit("1010988976066265329", { SEND_MESSAGES: false }).then(() => msg.channel.send("success"));
    // console.log(msg.guild);
    const channels = await msg.guild.channels.cache;
    const readOnlyChannels = ["998682973513728230"];
    let check;
    for (const channel of channels) {
      check = true;
      for (let i = 0; i < readOnlyChannels.length; i++) {
        if (channel[0] == readOnlyChannels[i]) {
          check = false;
        }
      }

      if (check && channel[1].type != "GUILD_CATEGORY" && channel[1].type != "GUILD_NEWS_THREAD" && channel[1].type != "GUILD_PUBLIC_THREAD" && channel[1].type != "GUILD_PRIVATE_THREAD" ) {
        console.log("1");
        const overwrites = await channel[1].permissionOverwrites.cache;
        if (overwrites.size == 0) {
          channel[1].permissionOverwrites.edit("998682692390506516", { VIEW_CHANNEL: true });
          console.log("lo yarutz");
        } else if (overwrites.size == 1) {
          overwrites.first().edit({ VIEW_CHANNEL: true });
        } else {
          for (let overwrite of overwrites) {
            if (overwrite[1].id != "998682692390506516") {
              overwrite[1].edit({ VIEW_CHANNEL: true });
            }
          }
        }
      }
    }
  }
});

client.login("MTAxMTAzNjY4OTA1NTEwMTA1OA.GYsav9.bf1iKPvNb2EIuJTssBAPIQ_bbwD8hieisvKjgU");