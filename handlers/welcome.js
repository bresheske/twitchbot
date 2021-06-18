const doOneEvery = require('../utils/timers/doOneEvery');
const pickOneOf = require('../utils/random/pickOneOf');

/**
 * a silly handler to say hi to people once per day.
 */
module.exports = (channel, tags, message, self, client) => {
    const secondsInDay = 86400;
    const username = tags.username;
    const sillymessage = pickOneOf([
        `welcome to the stream!`,
        `what's shakin, bacon?`,
        `what's up?`
    ]);
    doOneEvery(secondsInDay, `welcomeHandler-${username}`, () => {
        client.say(channel, `yo @${username}! ${sillymessage}`);
    });
}