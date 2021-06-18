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
module.exports = (seconds, name, action) => {
    // first gather the previous action by the name.
    const previousAction = actionStorage.find((a) => a.name === name);
    const currentTime = currentTimeInSeconds();
    // no action? then we kick off a new one.
    if (!previousAction) {
        actionStorage.push({ name, time: currentTime });
        action();
    }
    // we have a previous action, but we have already waited long enough.
    else if (previousAction.time + seconds <= currentTime) {
        previousAction.time = currentTime;
        action();
    }
    // otherwise, we throttle the call and do nothing.
};
