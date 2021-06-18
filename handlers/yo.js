const doOneEvery = require('../utils/timers/doOneEvery');

/**
 * a silly handler to respond 'yo' based on a timer.
 */
module.exports = (channel, tags, message, self, client) => {
    if(!message.toLowerCase().includes('yo'))
        return;
    doOneEvery(30, 'yoHandler', () => {
        client.say(channel, `yo`);
    });
}