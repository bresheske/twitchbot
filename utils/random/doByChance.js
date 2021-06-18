const randomInt = require('./randomInt');

/**
 * perform action if random chance is successful.
 * for example, send a chat message only 20% of the time
 * that says "yo.".
 * @param {*} chance - integer from 0 to 100.
 * @param {*} action - callback action to call if successful.
 */
module.exports = (chance, action) => {
    // get a random number between 0 and 100.
    const randomChance = randomInt(0, 100);
    // calculate the chance threshold.
    // example: if our chance is only 20%, that means
    //  the action should only be called 1 in 4 times.
    //  so, 100 - 20 equals 80. Is our result >= 80?
    const chanceThreshold = 100 - chance;
    if (randomChance >= chanceThreshold)
        action();
};
