const fs = require("fs");
const path = require("path");

/**
 * Get the key for the given value in an object.
 * @param {Object} object 
 * @param {any} value 
 * @returns Returns the key that corresponds to the value.
 */
module.exports.getKeyByValue = function (object, value)
{
    return Object.keys(object).find(key => object[key] === value);
};

/**
 * Formats milliseconds to minutes and seconds. 298999 -> 4:59
 * @param {Number} ms The amount of milliseconds to format.
 * @returns Returns the formatted string.
 */
module.exports.msToMinAndSec = function (ms)
{
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

/**
 * Formats the ms to days, hours, minutes and seconds and returns those values in an object.
 * @param {Number} ms The amount of milliseconds to format.
 */
module.exports.msToTimeObj = function (ms)
{
    return {
        days: Math.floor(ms / 86400000),
        hours: Math.floor(ms / 3600000) % 24,
        minutes: Math.floor(ms / 60000) % 60,
        seconds: Math.floor(ms / 1000) % 60
    };
};