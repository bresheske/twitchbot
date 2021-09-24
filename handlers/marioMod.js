const doOneEvery = require('../utils/timers/doOneEvery');
const memoryjs = require('memoryjs');
const switches = require('../utils/storage/switches');
const SWITCH_KEY = 'mariomod';


/**
 * a silly handler which listens to commands and injects data into SNES9x memory.
 */
module.exports = (channel, tags, message, self, client, options) => {

    const tolower = message.toLowerCase();

    if (tolower.startsWith('!time'))
        handleTime(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!cape'))
        handleCape(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!flower'))
        handleFlower(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!star'))
        handleStar(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!big'))
        handleBig(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!small'))
        handleSmall(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!pswitch'))
        handlePSwitch(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!spswitch'))
        handleSPSwitch(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!mariomod'))
        handleHelp(channel, tags, message, self, client, options);


    return;
}

const handleHelp = (channel, tags, message, self, client, options) => {
    const status = switches.isSwitchOn(SWITCH_KEY);
    let out = `@${tags.username} MarioMod is currently set to ${status ? 'ON' : 'OFF'}.`;
    if (status)
        out += `  List of fun commands you have access to: !cape, !flower, !star, !big, !small, !pswitch, !spswitch, !time <3-digit time>`;
    client.say(channel, out);
};


const handleTime = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }
    

    // grab the time to set.
    const timeToSet = message.split(' ')[1];
    if (!timeToSet || timeToSet.length !== 3 || !isNumeric(timeToSet)) {
        client.say(channel, `@${tags.username} !time <3-digit number>.`);
        return;
    }

    // convert our string of numbers into an array of hex values.
    const timeNumbers = timeToSet
        .split('')
        .map(digit => parseInt(digit));
    const dataBuffer = Buffer.from(timeNumbers);

    // after using CheatEngine, here's an offset to an address
    // containing a pointer that ends up pointing to the correct address
    // of the data that controls the timer shown on the screen.
    const pointerAddress = 0x8D8BE8;
    // and here's the offset to the location to find the actual data.
    const offset = 0xF31

    writeToPointer(pointerAddress, offset, dataBuffer);

    client.say(channel, `@${tags.username} timer set to ${timeToSet}!`);
};

const handleBig = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x19;
    // 0 = small, 1 = big, 2 = cape, 3 = fireflower
    const data = Buffer.from([0x01]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} we big yo!!`);
};

const handleSmall = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x19;
    // 0 = small, 1 = big, 2 = cape, 3 = fireflower
    const data = Buffer.from([0x00]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} we smol yo!`);
};


const handleFlower = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x19;
    // 0 = small, 1 = big, 2 = cape, 3 = fireflower
    const data = Buffer.from([0x03]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} flowerpower!`);
};


const handleCape = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x19;
    // 0 = small, 1 = big, 2 = cape, 3 = fireflower
    const data = Buffer.from([0x02]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} all caped up!`);
};

const handleStar = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x1490;
    // this is the timer that counts down to 0, which ends the star effect.
    const data = Buffer.from([0xFF]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} starman go!`);
};

const handlePSwitch = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x14AD;
    // this is the timer that counts down to 0, which ends the effect
    const data = Buffer.from([0xFF]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} switched that P!`);
};

const handleSPSwitch = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const pointerAddress = 0x8D8BE8;
    const offset = 0x14AE;
    // this is the timer that counts down to 0, which ends the effect
    const data = Buffer.from([0xFF]);

    writeToPointer(pointerAddress, offset, data);

    client.say(channel, `@${tags.username} switched that silver!`);
};


/**
 * this function will write do a 1-depth pointer to the snes rom.
 */
const writeToPointer = (pointerAddress, offset, dataBuffer) => {
    // grab the processID from SNES9x (or the first 'snes' application)
    const snesId = memoryjs
        .getProcesses()
        .find(proc => proc.szExeFile.includes('snes'))
        .th32ProcessID;
        
    // open the process for read/write
    const process = memoryjs.openProcess(snesId);
    const handle = process.handle;
    
    // gather all of the modules for the process.
    // this gives us our base memory address for memory allocated
    // for our game.
    const snesMod = memoryjs.getModules(snesId)
        .find(mod => mod.szModule.includes('snes'));
    const baseAddress = snesMod.modBaseAddr;

    // read in a 4 byte pointer to find the address of the data we're looking for.
    // note, we're using a specific endian syntax to reverse the bytes read.
    const pointerToData = memoryjs.readBuffer(handle, baseAddress + pointerAddress, 4).readIntLE(0, 4);
    const pointerWithOffset = pointerToData + offset;

    // finally write it out
    memoryjs.writeBuffer(handle, pointerWithOffset, dataBuffer);
}

const isNumeric = (str) => {
    if (typeof str != "string")
        return false
    return !isNaN(str) && !isNaN(parseFloat(str)) 
}



