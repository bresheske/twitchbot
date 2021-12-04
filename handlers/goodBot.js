const timers = require('../utils/timers/actionTimers');
const pickOneOf = require('../utils/random/pickOneOf');

/**
 * a silly handler that says <3 if someone says "good bot"
 */
module.exports = (channel, tags, message, self, client) => {
    if(message.toLowerCase() !== 'good bot')
        return;
    timers.doOneEvery(30, 'goodBotHandler', () => {
        client.say(channel, `<3`);
    });
};

