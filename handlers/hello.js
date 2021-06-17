module.exports = (channel, tags, message, self, client) => {
    if(message.toLowerCase() !== '!hello')
        return;

    client.say(channel, `@${tags.username}, Yo what's up`);
}