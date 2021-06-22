const doOneEvery = require('../utils/timers/doOneEvery');

/**
 * a silly handler to respond 'yo' based on a timer.
 * we want to handle "yo" or "yo " or " yo ".  But we
 * don't want to handle "yogurt".  
 * 
 * options: { delaySeconds = 30 }
 */
module.exports = (channel, tags, message, self, client, options) => {

    // easiest way I could think to do this was to break up the scenarios.
    const tolower = message.toLowerCase();
    const yoActive = 
            /^yo$/.test(tolower)
        ||  /\syo\s/.test(tolower)
        ||  /^yo\s/.test(tolower)
        ;

    if (!yoActive)
        return;

    // option defaults
    if (!options) {
        options = {};
    }

    // cannot simply just check for truthy, as a defined 0 returns false.
    options.delaySeconds = options.delaySeconds === null || options.delaySeconds === undefined
        ? 30
        : options.delaySeconds;

    doOneEvery(options.delaySeconds, 'yoHandler', () => {
        client.say(channel, `yo`);
    });
}