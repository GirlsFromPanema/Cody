"use strict";

var _require = require("discord.js"),
    Client = _require.Client,
    Message = _require.Message,
    MessageEmbed = _require.MessageEmbed;

var forbidded = require("../../banned");

var prefix = "$";
module.exports = {
  name: "say",
  description: "Display the Users avatar",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: function run(client, message, args) {
    var forbidden, i;
    return regeneratorRuntime.async(function run$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            forbidden = ["trash", "Trash", "@everyone", "@Everyone", "trash", "Trash", "gay", "Gay", "Trash", "Gaylord", "gaylord", "Nigger", "niger", "Cody trash", "trash Cody", "Asshole", "asshole", "Hoe", "hoe", "Nigga", "nigga", "cody trash", "noob"];
            i = 0;

          case 2:
            if (!(i < forbidden.length)) {
              _context.next = 10;
              break;
            }

            if (!message.content.includes(forbidden[i])) {
              _context.next = 7;
              break;
            }

            message["delete"]();
            message.channel.send("".concat(message.author.username, " you are not allowed to use that Word! I have blocked your last Input: ||").concat(args[0], "||"));
            return _context.abrupt("return");

          case 7:
            i++;
            _context.next = 2;
            break;

          case 10:
            if (args[0]) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", message.channel.send("I couldn't understand, could you repeat it please? But with a word please ...\nExample: **".concat(prefix, "say hello**")));

          case 12:
            message.channel.send(args[0]);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};