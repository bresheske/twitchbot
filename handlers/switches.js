const switches = require('../utils/storage/switches');
const users = require('../utils/twitch/users');

/**
 * a handler to toggle a switch on or off.
 */
module.exports = (channel, tags, message, self, client, options) => {

    const tolower = message.toLowerCase();

    if (tolower.startsWith(`!switches`))
        handleSwitches(channel, tags, message, self, client, options);
    else if (tolower.startsWith(`!switch`))
        handleSwitch(channel, tags, message, self, client, options);

}

const handleSwitches = (channel, tags, message, self, client, options) => {
    const switchmessage = switches
        .getAll()
        .map(sw => `${sw.name}: ${sw.value ? 'ON' : 'OFF'}`)
        .join(', ');
    client.say(channel, `@${tags.username} ${switchmessage}`);
};


const handleSwitch = (channel, tags, message, self, client, options) => {
    // only streamers or mods can alter a switch.
    if (!users.isUserStreamerOrMod(tags)) {
        client.say(channel, `${tags.username} only a mod can do that.`);
        return;
    }

    const tolower = message.toLowerCase();
    const switchname = tolower.split(' ')[1];
    if (!switchname) {
        client.say(channel, `${tags.username} !switch <switchName>`);
        return;
    }

    switches.toggleSwitch(switchname);
    const status = switches.isSwitchOn(switchname);
    client.say(channel, `@${tags.username} switch '${switchname}' is now ${status ? 'ON' : 'OFF'}`);
};
