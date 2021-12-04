const timers = require('../utils/timers/actionTimers');

/**
 * a silly little handler to timeout a moderator, but had some extra features.
 * 
 * !timeouthops - attempts to time out a mod.
 *    the mod will be timed out for X seconds.
 *    the mod can only be timed out once every Y seconds.
 *    if an attempt is made to timeout the mod before Y seconds has elapsed, the user
 *      to request it is timed out instead.  :)
 */
module.exports = (channel, tags, message, self, client) => {
    if(message.toLowerCase() !== '!timeouthops')
        return;

    // check to see if the next action can actually be executed.
    if (timers.canDoOneEvery(600, `timeouthops`)) {
        // we can timeouthops - but we'll want to use the doOnceEvery to
        // make sure we register another action timer.
        timers.doOneEvery(600, `timeouthops`, () => {
            client.say(channel, `/timeout mrhops22 10 suck it hops!`);
            client.say(channel, `suck it hops!`);
        });
    }
    else {
        client.say(channel, `/timeout ${tags.username} 69 suck it ${tags.username}!`);
        client.say(channel, `suck it ${tags.username}!`);
    }
}