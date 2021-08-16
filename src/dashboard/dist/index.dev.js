"use strict";

var express = require("express");

var MongoStore = require("connect-mongo");

var app = express();

var Discord = require("discord.js");

var rateLimit = require("express-rate-limit");

var passport = require("passport");

var session = require("express-session");

var Strategy = require("passport-discord").Strategy;

var ejs = require("ejs");

var bodyParser = require("body-parser");

var url = require("url");

var path = require("path");

var nicknameCooldown = new Set();

var moment = require("moment");

var config = require("../config.json");

var port = config.PORT || 8000;

var User = require("../database/schemas/User");

var minifyHTML = require("express-minify-html-terser");

var Guild = require("../database/schemas/Guild");

var rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  statusCode: 429,
  max: 50,
  message: "Too many requests, please try again in a minute"
});

module.exports = function _callee10(client) {
  var templateDir, checkAuth, limit, render;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          app.use(express["static"]("src/dashboard/static"));
          templateDir = path.resolve("src/dashboard/templates");
          passport.serializeUser(function (user, done) {
            return done(null, user);
          });
          passport.deserializeUser(function (obj, done) {
            return done(null, obj);
          });
          passport.use(new Strategy({
            clientID: config.client_id,
            clientSecret: config.client_secret,
            callbackURL: "".concat(config.domain, "/callback"),
            response_type: "token",
            scope: ["identify", "guilds"]
          }, function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
              return done(null, profile);
            });
          }));
          app.use(rateLimiter);
          app.use(session({
            secret: "aASDASDewwfSAFasdadasdasdasdasadasdasdwqd3242323yvu4vhy234hy2343v2h4234hjv23423hjb423hjb4234hjb324234324vj324234byjdasdasdadasdad",
            resave: true,
            saveUninitialized: true,
            cookie: {
              maxAge: Date.now() + 2629800000
            },
            store: MongoStore.create({
              mongoUrl: config.mongo_database_link
            })
          }));
          app.locals.moment = moment;

          checkAuth = function checkAuth(req, res, next) {
            if (req.isAuthenticated()) return next();
            req.session.backURL = req.url;
            render(res, req, "other/login/login.ejs");
          };

          app.use(minifyHTML({
            override: true,
            exception_url: false,
            htmlMinifier: {
              removeComments: true,
              collapseWhitespace: true,
              collapseBooleanAttributes: true,
              removeAttributeQuotes: true,
              removeEmptyAttributes: true,
              minifyJS: true
            }
          }));
          app.enable("trust proxy");
          app.use(passport.initialize());
          app.use(passport.session());
          app.engine("html", ejs.renderFile);
          app.set("view engine", "html");
          app.use(bodyParser.json());
          app.use(bodyParser.urlencoded({
            extended: true
          }));
          limit = rateLimit({
            windowMs: 60 * 1000,
            max: 10,
            message: "Too many requests, please try again in a minute",
            statusCode: 429
          });

          render = function render(res, req, template) {
            var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var hostname = req.headers.host;
            var pathname = url.parse(req.url).pathname;
            var websiteData = {
              client: client,
              hostname: hostname,
              pathname: pathname,
              path: req.path,
              user: req.isAuthenticated() ? req.user : null,
              url: res,
              req: req,
              config: config,
              https: "https://",
              domain: config.domain
            };
            res.render(path.resolve("".concat(templateDir).concat(path.sep).concat(template)), Object.assign(websiteData, data));
          }; // Login endpoint


          app.get("/login", function (req, res, next) {
            if (req.user) return res.redirect("/");

            if (req.session.backURL) {
              req.session.backURL = req.session.backURL;
            } else if (req.headers.referer) {
              var parsed = url.parse(req.headers.referer);

              if (parsed.hostname === app.locals.domain) {
                req.session.backURL = parsed.path;
              }
            } else {
              req.session.backURL = "/";
            }

            next();
          }, passport.authenticate("discord", {
            prompt: "none"
          })); //discord endpoint

          app.get("/discord", function (req, res) {
            res.redirect("https://discord.gg/7aHr9kJBxy");
          }); //invite endpoint

          app.get("/invite", function (req, res) {
            res.redirect("https://discord.com/oauth2/authorize?client_id=858311918447099925&permissions=240518548544&scope=bot");
          }); //invite api

          app.get("/api/invite", function (req, res) {
            var url = req.protocol + "://" + req.get("host") + req.originalUrl;
            var redirect = new URL(url).searchParams.get("guild_id");

            if (redirect) {
              res.redirect("/panel/".concat(redirect));
            } else return res.json({
              error: "No guild ID requested"
            });
          }); //policy

          app.get("/policy", function (req, res) {
            return render(res, req, "other/policy/policy.ejs");
          }); //dashboard

          app.get("/panel", checkAuth, function (req, res) {
            render(res, req, "dashboard/dashboard.ejs", {
              perms: Discord.Permissions
            });
          }); // dashboard endpoint (settings)

          app.get("/panel/:guildID", checkAuth, function _callee(req, res) {
            var guild, member;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    guild = client.guilds.cache.get(req.params.guildID);

                    if (guild) {
                      _context.next = 4;
                      break;
                    }

                    res.status(500);
                    return _context.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Invalid Guild Provided"
                    }));

                  case 4:
                    member = guild.members.cache.get(req.user.id);

                    if (member) {
                      _context.next = 8;
                      break;
                    }

                    res.status(500);
                    return _context.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not a member of this Guild"
                    }));

                  case 8:
                    if (member.permissions.has("MANAGE_GUILD")) {
                      _context.next = 11;
                      break;
                    }

                    res.status(500);
                    return _context.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not allowed to view this Page"
                    }));

                  case 11:
                    render(res, req, "dashboard/dashboard/index.ejs", {
                      guild: guild
                    });

                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          app.get("/me", checkAuth, function _callee2(req, res) {
            var user, findUser, newUser;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    user = client.userSettings.get(req.user.id);

                    if (user) {
                      _context2.next = 11;
                      break;
                    }

                    _context2.next = 4;
                    return regeneratorRuntime.awrap(User.findOne({
                      Id: req.user.id
                    }));

                  case 4:
                    findUser = _context2.sent;

                    if (findUser) {
                      _context2.next = 11;
                      break;
                    }

                    _context2.next = 8;
                    return regeneratorRuntime.awrap(User.create({
                      Id: req.user.id
                    }));

                  case 8:
                    newUser = _context2.sent;
                    client.userSettings.set(req.user.id, newUser);
                    user = newUser;

                  case 11:
                    render(res, req, "dashboard/dashboard/me/me.ejs", {
                      settings: user
                    });

                  case 12:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          app.post("/me", checkAuth, limit, function _callee3(req, res) {
            var user, data, newUser;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(User.findOne({
                      Id: req.user.id
                    }));

                  case 2:
                    user = _context3.sent;

                    if (user) {
                      _context3.next = 8;
                      break;
                    }

                    _context3.next = 6;
                    return regeneratorRuntime.awrap(User.create({
                      Id: req.user.id
                    }));

                  case 6:
                    user = _context3.sent;
                    client.userSettings.set(req.user.id, user);

                  case 8:
                    data = req.body;

                    if (data.toggle) {
                      user.hide = true;
                    } else {
                      user.hide = false;
                    }

                    _context3.next = 12;
                    return regeneratorRuntime.awrap(user.save());

                  case 12:
                    newUser = _context3.sent;
                    client.userSettings.set(req.user.id, newUser);
                    res.status(200);
                    res.send({
                      status: 200,
                      user: newUser
                    });

                  case 16:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          }); // leaderboard

          app.get("/leaderboard", function _callee4(req, res) {
            var users, array, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user, db, fetch, obj;

            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(User.find({
                      hide: false
                    }).sort({
                      xp: -1
                    }).limit(10));

                  case 2:
                    users = _context4.sent;
                    array = [];
                    i = 1;
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context4.prev = 8;

                    for (_iterator = users[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      user = _step.value;
                      db = client.userSettings.get(user.Id);

                      if (db) {
                        fetch = client.users.cache.get(user.Id);

                        if (fetch && fetch.username) {
                          obj = {
                            name: fetch.tag,
                            avatar: fetch.avatar,
                            id: user.Id,
                            level: user.courses && user.courses.length > 1 ? user.courses.reduce(function (a, b) {
                              return a.course.Level || 0 + b.course.Level || 0;
                            }) : user.courses.Level || 0
                          };
                          array.push(obj);
                          i++;
                        }
                      }
                    }

                    _context4.next = 16;
                    break;

                  case 12:
                    _context4.prev = 12;
                    _context4.t0 = _context4["catch"](8);
                    _didIteratorError = true;
                    _iteratorError = _context4.t0;

                  case 16:
                    _context4.prev = 16;
                    _context4.prev = 17;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 19:
                    _context4.prev = 19;

                    if (!_didIteratorError) {
                      _context4.next = 22;
                      break;
                    }

                    throw _iteratorError;

                  case 22:
                    return _context4.finish(19);

                  case 23:
                    return _context4.finish(16);

                  case 24:
                    render(res, req, "dashboard/dashboard/leaderboard/leaderboard.ejs", {
                      users: array || [],
                      isGuild: false,
                      guild: null
                    });

                  case 25:
                  case "end":
                    return _context4.stop();
                }
              }
            }, null, null, [[8, 12, 16, 24], [17,, 19, 23]]);
          }); // dashboard endpoint for leaderboard

          app.get("/panel/:guildID/leaderboard/", checkAuth, function _callee5(req, res) {
            var guild, member, users, array, i, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, user, db, fetch, obj;

            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    guild = client.guilds.cache.get(req.params.guildID);

                    if (guild) {
                      _context5.next = 4;
                      break;
                    }

                    res.status(500);
                    return _context5.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Invalid Guild Provided"
                    }));

                  case 4:
                    member = guild.members.cache.get(req.user.id);

                    if (member) {
                      _context5.next = 8;
                      break;
                    }

                    res.status(500);
                    return _context5.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not a member of this Guild"
                    }));

                  case 8:
                    if (member.permissions.has("MANAGE_GUILD")) {
                      _context5.next = 11;
                      break;
                    }

                    res.status(500);
                    return _context5.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not allowed to view this Page"
                    }));

                  case 11:
                    _context5.next = 13;
                    return regeneratorRuntime.awrap(User.find({
                      hide: false
                    }).sort({
                      xp: -1
                    }).limit(10));

                  case 13:
                    users = _context5.sent;
                    array = [];
                    i = 1;
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context5.prev = 19;
                    _iterator2 = users[Symbol.iterator]();

                  case 21:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                      _context5.next = 32;
                      break;
                    }

                    user = _step2.value;
                    db = client.userSettings.get(user.Id);

                    if (!db) {
                      _context5.next = 29;
                      break;
                    }

                    _context5.next = 27;
                    return regeneratorRuntime.awrap(guild.members.fetch(user.Id));

                  case 27:
                    fetch = _context5.sent;

                    if (fetch && fetch.user.username) {
                      obj = {
                        name: fetch.user.username + "#" + fetch.user.discriminator,
                        avatar: fetch.user.avatar,
                        id: user.Id,
                        level: user.courses && user.courses.length > 1 ? user.courses.reduce(function (a, b) {
                          return a.course.Level || 0 + b.course.Level || 0;
                        }) : user.courses.Level || 0
                      };
                      array.push(obj);
                      i++;
                    }

                  case 29:
                    _iteratorNormalCompletion2 = true;
                    _context5.next = 21;
                    break;

                  case 32:
                    _context5.next = 38;
                    break;

                  case 34:
                    _context5.prev = 34;
                    _context5.t0 = _context5["catch"](19);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context5.t0;

                  case 38:
                    _context5.prev = 38;
                    _context5.prev = 39;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                      _iterator2["return"]();
                    }

                  case 41:
                    _context5.prev = 41;

                    if (!_didIteratorError2) {
                      _context5.next = 44;
                      break;
                    }

                    throw _iteratorError2;

                  case 44:
                    return _context5.finish(41);

                  case 45:
                    return _context5.finish(38);

                  case 46:
                    render(res, req, "dashboard/dashboard/leaderboard/leaderboard.ejs", {
                      guild: guild,
                      alert: null,
                      users: array,
                      isGuild: true
                    });

                  case 47:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[19, 34, 38, 46], [39,, 41, 45]]);
          }); // dashboard endpoint for settings general page

          app.get("/panel/:guildID/settings/", checkAuth, function _callee6(req, res) {
            var guild, member, settings, findSettings, newGuild;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    guild = client.guilds.cache.get(req.params.guildID);

                    if (guild) {
                      _context6.next = 4;
                      break;
                    }

                    res.status(500);
                    return _context6.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Invalid Guild Provided"
                    }));

                  case 4:
                    member = guild.members.cache.get(req.user.id);

                    if (member) {
                      _context6.next = 8;
                      break;
                    }

                    res.status(500);
                    return _context6.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not a member of this Guild"
                    }));

                  case 8:
                    if (member.permissions.has("MANAGE_GUILD")) {
                      _context6.next = 11;
                      break;
                    }

                    res.status(500);
                    return _context6.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not allowed to view this Page"
                    }));

                  case 11:
                    settings = client.guildSettings.get(guild.id);

                    if (settings) {
                      _context6.next = 22;
                      break;
                    }

                    _context6.next = 15;
                    return regeneratorRuntime.awrap(Guild.findOne({
                      Id: guild.id
                    }));

                  case 15:
                    findSettings = _context6.sent;

                    if (findSettings) {
                      _context6.next = 22;
                      break;
                    }

                    _context6.next = 19;
                    return regeneratorRuntime.awrap(Guild.create({
                      Id: guild.id,
                      prefix: config.prefix
                    }));

                  case 19:
                    newGuild = _context6.sent;
                    client.guildSettings.set(guild.id, newGuild);
                    settings = client.guildSettings.get(guild.id);

                  case 22:
                    if (settings) {
                      _context6.next = 24;
                      break;
                    }

                    return _context6.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Please wait a little and try again."
                    }));

                  case 24:
                    render(res, req, "dashboard/dashboard/settings/settings.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: null
                    });

                  case 25:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          }); // dashboard endpoint for settings general page - post

          app.post("/panel/:guildID/settings", checkAuth, function _callee7(req, res) {
            var guild, member, settings, newGuild, data, nickname, prefix, newSettings;
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    guild = client.guilds.cache.get(req.params.guildID);

                    if (guild) {
                      _context7.next = 4;
                      break;
                    }

                    res.status(500);
                    return _context7.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Invalid Guild Provided"
                    }));

                  case 4:
                    member = guild.members.cache.get(req.user.id);

                    if (member) {
                      _context7.next = 8;
                      break;
                    }

                    res.status(500);
                    return _context7.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not a member of this Guild"
                    }));

                  case 8:
                    if (member.permissions.has("MANAGE_GUILD")) {
                      _context7.next = 11;
                      break;
                    }

                    res.status(500);
                    return _context7.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not allowed to view this Page"
                    }));

                  case 11:
                    _context7.next = 13;
                    return regeneratorRuntime.awrap(Guild.findOne({
                      Id: guild.id
                    }));

                  case 13:
                    settings = _context7.sent;

                    if (settings) {
                      _context7.next = 22;
                      break;
                    }

                    _context7.next = 17;
                    return regeneratorRuntime.awrap(Guild.create({
                      Id: guild.id,
                      prefix: config.prefix
                    }));

                  case 17:
                    newGuild = _context7.sent;
                    client.guildSettings.set(guild.id, newGuild);
                    _context7.next = 21;
                    return regeneratorRuntime.awrap(Guild.findOne({
                      Id: guild.id
                    }));

                  case 21:
                    settings = _context7.sent;

                  case 22:
                    if (settings) {
                      _context7.next = 25;
                      break;
                    }

                    res.status(200);
                    return _context7.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Please cool down and try again."
                    }));

                  case 25:
                    data = req.body;
                    _context7.prev = 26;

                    if (!(data.nickname && data.nickname !== guild.me.nickname || guild.me.user.username)) {
                      _context7.next = 45;
                      break;
                    }

                    nickname = data.nickname;

                    if (!(nickname.length < 32)) {
                      _context7.next = 43;
                      break;
                    }

                    if (nicknameCooldown.has(guild.id)) {
                      _context7.next = 41;
                      break;
                    }

                    nicknameCooldown.add(guild.id);
                    setTimeout(function () {
                      nicknameCooldown["delete"](guild.id);
                    }, 10000);
                    _context7.prev = 33;
                    _context7.next = 36;
                    return regeneratorRuntime.awrap(guild.me.setNickname(nickname));

                  case 36:
                    _context7.next = 41;
                    break;

                  case 38:
                    _context7.prev = 38;
                    _context7.t0 = _context7["catch"](33);
                    render(res, req, "dashboard/dashboard/settings/settings.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: _context7.t0
                    });

                  case 41:
                    _context7.next = 45;
                    break;

                  case 43:
                    render(res, req, "dashboard/dashboard/settings/settings.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: "Nickname length must be under 32 characters"
                    });
                    return _context7.abrupt("return");

                  case 45:
                    if (!(data.prefix && data.prefix !== settings.prefix)) {
                      _context7.next = 59;
                      break;
                    }

                    prefix = data.prefix.trim().replace(/\s/g, "");

                    if (!(!prefix || !prefix.length)) {
                      _context7.next = 51;
                      break;
                    }

                    settings.prefix = config.prefix;
                    _context7.next = 57;
                    break;

                  case 51:
                    if (!(prefix.length < 5)) {
                      _context7.next = 55;
                      break;
                    }

                    settings.prefix = prefix;
                    _context7.next = 57;
                    break;

                  case 55:
                    render(res, req, "dashboard/dashboard/settings/settings.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: "Prefix length must be under 5 characters"
                    });
                    return _context7.abrupt("return");

                  case 57:
                    _context7.next = 60;
                    break;

                  case 59:
                    if (!data.prefix) settings.prefix = config.prefix;

                  case 60:
                    _context7.next = 65;
                    break;

                  case 62:
                    _context7.prev = 62;
                    _context7.t1 = _context7["catch"](26);
                    return _context7.abrupt("return", res.send("Something seems wrong. Try again later"));

                  case 65:
                    _context7.next = 67;
                    return regeneratorRuntime.awrap(settings.save({
                      "new": true
                    }));

                  case 67:
                    newSettings = _context7.sent;
                    client.guildSettings.set(guild.id, newSettings);
                    res.status(200);
                    render(res, req, "dashboard/dashboard/settings/settings.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: "success"
                    });

                  case 71:
                  case "end":
                    return _context7.stop();
                }
              }
            }, null, null, [[26, 62], [33, 38]]);
          }); // dashboard endpoint for toggles

          app.get("/panel/:guildID/toggles/", checkAuth, function _callee8(req, res) {
            var guild, member, settings, findSettings, newGuild;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    guild = client.guilds.cache.get(req.params.guildID);

                    if (guild) {
                      _context8.next = 4;
                      break;
                    }

                    res.status(500);
                    return _context8.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Invalid Guild Provided"
                    }));

                  case 4:
                    member = guild.members.cache.get(req.user.id);

                    if (member) {
                      _context8.next = 8;
                      break;
                    }

                    res.status(500);
                    return _context8.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not a member of this Guild"
                    }));

                  case 8:
                    if (member.permissions.has("MANAGE_GUILD")) {
                      _context8.next = 11;
                      break;
                    }

                    res.status(500);
                    return _context8.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not allowed to view this Page"
                    }));

                  case 11:
                    settings = client.guildSettings.get(guild.id);

                    if (settings) {
                      _context8.next = 22;
                      break;
                    }

                    _context8.next = 15;
                    return regeneratorRuntime.awrap(Guild.findOne({
                      Id: guild.id
                    }));

                  case 15:
                    findSettings = _context8.sent;

                    if (findSettings) {
                      _context8.next = 22;
                      break;
                    }

                    _context8.next = 19;
                    return regeneratorRuntime.awrap(Guild.create({
                      Id: guild.id,
                      prefix: config.prefix
                    }));

                  case 19:
                    newGuild = _context8.sent;
                    client.guildSettings.set(guild.id, newGuild);
                    settings = client.guildSettings.get(guild.id);

                  case 22:
                    if (settings) {
                      _context8.next = 24;
                      break;
                    }

                    return _context8.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Please wait a little and try again."
                    }));

                  case 24:
                    render(res, req, "dashboard/dashboard/toggles/toggles.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: null,
                      commands: client.commands.filter(function (cmd) {
                        return cmd.category !== "👑 Owner";
                      }).array()
                    });

                  case 25:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          }); // toggles post

          app.post("/panel/:guildID/toggles", checkAuth, function _callee9(req, res) {
            var guild, member, settings, newGuild, data, newSettings;
            return regeneratorRuntime.async(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    guild = client.guilds.cache.get(req.params.guildID);

                    if (guild) {
                      _context9.next = 4;
                      break;
                    }

                    res.status(500);
                    return _context9.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Invalid Guild Provided"
                    }));

                  case 4:
                    member = guild.members.cache.get(req.user.id);

                    if (member) {
                      _context9.next = 8;
                      break;
                    }

                    res.status(500);
                    return _context9.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not a member of this Guild"
                    }));

                  case 8:
                    if (member.permissions.has("MANAGE_GUILD")) {
                      _context9.next = 11;
                      break;
                    }

                    res.status(500);
                    return _context9.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "You are not allowed to view this Page"
                    }));

                  case 11:
                    _context9.next = 13;
                    return regeneratorRuntime.awrap(Guild.findOne({
                      Id: guild.id
                    }));

                  case 13:
                    settings = _context9.sent;

                    if (settings) {
                      _context9.next = 22;
                      break;
                    }

                    _context9.next = 17;
                    return regeneratorRuntime.awrap(Guild.create({
                      Id: guild.id,
                      prefix: config.prefix
                    }));

                  case 17:
                    newGuild = _context9.sent;
                    client.guildSettings.set(guild.id, newGuild);
                    _context9.next = 21;
                    return regeneratorRuntime.awrap(Guild.findOne({
                      Id: guild.id
                    }));

                  case 21:
                    settings = _context9.sent;

                  case 22:
                    if (settings) {
                      _context9.next = 25;
                      break;
                    }

                    res.status(200);
                    return _context9.abrupt("return", render(res, req, "other/error/error.ejs", {
                      error: "Please cool down and try again."
                    }));

                  case 25:
                    data = req.body;

                    if (data.blockChannels) {
                      if (typeof data.blockChannels === "string") {
                        settings.disabledChannels = [data.blockChannels];
                      } else {
                        settings.disabledChannels = data.blockChannels;
                      }
                    } else settings.disabledChannels = [];

                    if (data.blockCommands) {
                      if (typeof data.blockCommands === "string") {
                        settings.disabledCommands = [data.blockCommands];
                      } else {
                        settings.disabledCommands = data.blockCommands;
                      }
                    } else settings.disabledCommands = [];

                    _context9.next = 30;
                    return regeneratorRuntime.awrap(settings.save({
                      "new": true
                    }));

                  case 30:
                    newSettings = _context9.sent;
                    client.guildSettings.set(guild.id, newSettings);
                    res.status(200);
                    render(res, req, "dashboard/dashboard/toggles/toggles.ejs", {
                      guild: guild,
                      settings: settings,
                      alert: "success",
                      commands: client.commands.filter(function (cmd) {
                        return cmd.category !== "👑 Owner";
                      }).array()
                    });

                  case 34:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          }); // Callback endpoint

          app.get("/callback", passport.authenticate("discord", {
            failureRedirect: "/"
          }), function (req, res) {
            if (req.session.backURL) {
              var _url = req.session.backURL;
              req.session.backURL = null;
              res.redirect(_url);
            } else {
              res.redirect("/");
            }
          });
          app.get("/api", function (req, res) {
            res.header("Content-Type", "application/json");
            var obj = {
              guilds: client.guilds.cache.size,
              members: client.guilds.cache.size,
              roles: client.guilds.cache.size,
              channels: client.channels.cache.size,
              ping: client.ws.ping,
              uptime: client.uptime,
              ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
            };
            res.json(obj);
          }); //status page

          app.get("/status", function (req, res) {
            render(res, req, "other/status/status.ejs", {});
          }); //logout

          app.get("/logout", function (req, res) {
            req.session.destroy(function () {
              req.logout();
              res.redirect("/");
            });
          }); //contact

          app.get("/contact", function (req, res) {
            if (!req.user) req.session.backURL = "/contact";
            render(res, req, "other/contact/contact.ejs", {
              alert: null
            });
          }); //contact post

          app.post("/contact", checkAuth, function (req, res) {
            var contact = new Discord.MessageEmbed().setColor("RANDOM").setTitle("\uD83D\uDCEC Contact Form").setDescription("Someone just send a message to us!").addField("\uD83D\uDC65 User", "".concat(req.user.username || "Unknown", "/<@").concat(req.user.id, "> (ID: `").concat(req.user.id || "Unknown", "`)")).addField("📝 Message", "```".concat(req.body.message.substr(0, 2000) || "None", "```")).setTimestamp(); //fill contact webhook here

            new Discord.WebhookClient("", "").send({
              embeds: [contact]
            });
            render(res, req, "other/contact/contact.ejs", {
              alert: true
            });
          }); //main page

          app.get("/", function (req, res) {
            render(res, req, "index.ejs");
          }); //404 page

          app.use(function (req, res, next) {
            res.status(404);
            render(res, req, "other/404/404.ejs");
          }); //error page

          app.use(function (error, req, res, next) {
            console.warn(error.stack);
            res.status(500);
            render(res, req, "other/500/500.ejs");
          });
          app.listen(port, null, null, function () {
            return console.log("WEBSITE ONLINE AT PORT " + port);
          });

        case 44:
        case "end":
          return _context10.stop();
      }
    }
  });
};