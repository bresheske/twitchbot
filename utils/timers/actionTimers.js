const actionStorage = [];

const currentTimeInSeconds = () => Math.floor(Date.now() / 1000);

/**
 * Function that throttles actions by only occuring once every
 * X seconds.  
 * 
 * For example: maybe we want to respond to messages that contain
 *  'yo' but we only want to do that once every 20 seconds. 
 * @param {*} seconds - number of seconds to throttle calls by.
 * @param {*} name - name of the action.
 * @param {*} action - action to be called once every X seconds.
 */
const doOneEvery = (seconds, name, action) => {
    // first gather the previous action by the name.
    const previousAction = actionStorage.find((a) => a.name === name);
    const currentTime = currentTimeInSeconds();
    // no action? then we kick off a new one.
    if (!previousAction) {
        actionStorage.push({ name, time: currentTime });
        action();
    }
    // we have a previous action, but we have already waited long enough.
    // OR - seconds is set to 0, which is mostly for testing environments.
    else if (seconds == 0 || previousAction.time + seconds <= currentTime) {
        previousAction.time = currentTime;
        action();
    }
    // otherwise, we throttle the call and do nothing.
};

/**
 * returns true or false if an action can be executed yet.
 * @param {*} seconds - number of seconds to throttle calls by.
 * @param {*} name - name of the action.
 */
const canDoOneEvery = (seconds, name) => {
    // first gather the previous action by the name.
    const previousAction = actionStorage.find((a) => a.name === name);
    const currentTime = currentTimeInSeconds();
    // no action? then we kick off a new one.
    if (!previousAction) {
        return true;
    }
    // we have a previous action, but we have already waited long enough.
    // OR - seconds is set to 0, which is mostly for testing environments.
    else if (seconds == 0 || previousAction.time + seconds <= currentTime) {
        return true;
    }
    // otherwise, we throttle the call and do nothing.
    return false;
};

module.exports = {
    doOneEvery,
    canDoOneEvery
}