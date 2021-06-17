module.exports = (channel, tags, message, self, client) => {
    if(!message.toLowerCase().startsWith('!so'))
        return;

    // grab the user to shout out
    let shoutoutuser = message.split(' ')[1];
    if (!shoutoutuser) {
        client.say(channel, `Hey @${tags.username}, I couldn't find a person to shout-out. Usage: !so <username>`);
        return;
    }

    // remove all @ characters, in case they were there.
    shoutoutuser = shoutoutuser.replace(/@/g, '');

    // send away
    const shoutoutchannel = `twitch.tv/${shoutoutuser}`;
    client.say(channel, `Please check out ${shoutoutuser}'s channel: ${shoutoutchannel}. They're pretty rad.`);
}