"use strict";

var Discord = require('discord.js');

var schema = require('../../database/schemas/Code');

var moment = require('moment');

var voucher_codes = require('voucher-code-generator');

module.exports = {
  name: 'gencode',
  category: '👑 Owner',
  description: 'Generates a premium code',
  cooldown: 0,
  ownerOnly: true,
  run: function run(client, message, args, user, guild) {
    var codes, plan, plans, time, amount, i, codePremium, code, find;
    return regeneratorRuntime.async(function run$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            codes = [];
            plan = args[0];
            plans = ['daily', 'weekly', 'monthly'];

            if (plan) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", message.channel.send("**> Please provide plan**"));

          case 5:
            if (plans.includes(args[0])) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", message.channel.send("**Invalid Plan, available plans:** ".concat(plans.join(', '))));

          case 7:
            if (plan === 'daily') time = Date.now() + 86400000;
            if (plan === 'weekly') time = Date.now() + 86400000 * 7;
            if (plan === 'monthly') time = Date.now() + 86400000 * 30;
            amount = args[1];
            if (!amount) amount = 1;
            i = 0;

          case 13:
            if (!(i < amount)) {
              _context.next = 23;
              break;
            }

            codePremium = voucher_codes.generate({
              pattern: '####-####-####'
            });
            code = codePremium.toString().toUpperCase();
            _context.next = 18;
            return regeneratorRuntime.awrap(schema.findOne({
              code: code
            }));

          case 18:
            find = _context.sent;

            if (!find) {
              schema.create({
                code: code,
                plan: plan,
                expiresAt: time
              });
              codes.push("".concat(i + 1, "- ").concat(code));
            }

          case 20:
            i++;
            _context.next = 13;
            break;

          case 23:
            message.author.send("```Generated +".concat(codes.length, "\n\n--------\n").concat(codes.join('\n'), "\n--------\n\nType - ").concat(plan, "\nExpires - ").concat(moment(time).format('dddd, MMMM Do YYYY'), "```"));

          case 24:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};