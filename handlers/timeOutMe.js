/**
 * This is a silly little handler that times out a user for X seconds.
 */
module.exports = (channel, tags, message, self, client) => {
    if(message !== '!timeoutme')
        return;

    const user = tags.username;
    client.say(channel, `/timeout ${user} 10 "get recked nerd"`);
}