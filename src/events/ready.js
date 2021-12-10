const client = require("../../src/index");
const User = require("../database/schemas/User");
const Guild = require("../database/schemas/Guild");
const fs = require("fs");

// Logs when the Bot comes online, once.
client.on("ready", async () => {
  console.log(`${client.user.tag} is now online!`);

  const filename = `./Logs/logging.txt`;
  const date = new Date().toLocaleString();
  const content = `Time: ${date}\nSuccessfully logged in as ${client.user.tag}!`;

  // The Bots status
  client.user.setActivity("$info • cody-bot.xyz", { type: "PLAYING" });

  // Fetch the Users with the current Settings
  const users = await User.find();
  for (let user of users) {
    client.userSettings.set(user.Id, user);
  }

  // Fetch the Guild Settings for all Guilds Setup yet and load them into a loop.
  const guilds = await Guild.find();
  for (let guild of guilds) {
    client.guildSettings.set(guild.Id, guild);
  }

  // Creating logs for the Bot
  fs.mkdir("Logs", (err) => {
    if (err) return err;
  });

  fs.writeFile(filename, content, (err) => {
    if (err) return err;
  });

  // Check for any premium users on the current Client
  require("../handlers/premium")(client);
});
