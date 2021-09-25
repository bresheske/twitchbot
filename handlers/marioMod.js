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
    else if (tolower.startsWith('!kaizo'))
        handleKaizo(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!water'))
        handleWater(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!land'))
        handleLand(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!ice'))
        handleIce(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!thaw'))
        handleThaw(channel, tags, message, self, client, options);





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

    writeToSWMAddress(0x007E0F31, dataBuffer);
};

const handleWater = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    writeToSWMAddress(0x007E0085, Buffer.from([0x01]));
};

const handleIce = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    writeToSWMAddress(0x007E0086, Buffer.from([0xFF]));
};

const handleThaw = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    writeToSWMAddress(0x007E0086, Buffer.from([0x00]));
};


const handleLand = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    writeToSWMAddress(0x007E0085, Buffer.from([0x00]));
};



const handleBig = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const data = Buffer.from([0x01]);
    writeToSWMAddress(0x007E0019, data);

};

const handleSmall = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const data = Buffer.from([0x00]);
    writeToSWMAddress(0x007E0019, data);
};


const handleFlower = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const data = Buffer.from([0x03]);
    writeToSWMAddress(0x007E0019, data);
};


const handleCape = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const data = Buffer.from([0x02]);
    writeToSWMAddress(0x007E0019, data);
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

};

const handlePSwitch = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const data = Buffer.from([0xFF]);
    writeToSWMAddress(0x007E14AD, data);
};

const handleSPSwitch = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const data = Buffer.from([0xFF]);
    writeToSWMAddress(0x007E14AE, data);
};

const handleKaizo = (channel, tags, message, self, client, options) => {

    // first check our switches to see if the mariomod is actually on.
    if(!switches.isSwitchOn(SWITCH_KEY)) {
        client.say(channel, `@${tags.username} MarioMod switch is currently off.`);
        return;
    }

    const proc = openProcess();    
    
    // here's our routine: https://www.smwcentral.net/?p=memorymap&game=smw&region=rom&address=00BEB0
    const routine = proc.baseAddress + 0x00BEB0;
    
    // -------------------------------
    // just some testing garbage here.
    const marioXSpeedByte = convertSMWCentralAddressToReal(0x007E007B);
    const marioYSpeedByte = convertSMWCentralAddressToReal(0x007E007D);

    
    // lets write some data to the realaddress! who knows lolz.
    // memoryjs.writeBuffer(proc.handle, marioXSpeedByte, Buffer.from([0x7F]));
    // memoryjs.writeBuffer(proc.handle, marioYSpeedByte, Buffer.from([0x80]));

    memoryjs.writeBuffer(proc.handle, marioYSpeedByte, Buffer.from([0x7F]));


    // -------------------------------

};

/**
 * Writes data to an address found on smwcentral.com.
 * This function also converts the address into a real address found in SNES9x.
 */
const writeToSWMAddress = (address, data) => {
    const realAddress = convertSMWCentralAddressToReal(address);
    const proc = openProcess();
    memoryjs.writeBuffer(proc.handle, realAddress, data);
};

/**
 * This fun little guy converts an address found in the MemoryMap of SMWCentral into
 * an address that actually exists in our running application.
 */
const convertSMWCentralAddressToReal = (smwAddress) => {
    // we know how to gather the correct address for mario's powerup location.
    // we can use to this calculate an offset that we can then use for future
    // addresses. might be a bit inefficient, but should work.

    // here we just read in the address location to the powerup status.
    const proc = openProcess();
    const pointerToData = memoryjs.readBuffer(proc.handle, proc.baseAddress + 0x8D8BE8, 4).readIntLE(0, 4);
    const actualPowerupAddress = pointerToData + 0x19;

    // we have the actual (real) powerup address.  we can just calculate the offset from here.
    // formula is RealAddress = SMWCentralAddress + Offset
    const smwOffset = actualPowerupAddress - 0x007E0019;

    // we caculated the offset, so now we just need to add that to the given
    // address and that should handle our conversion correctly.
    return smwAddress + smwOffset;
};

const openProcess = () => {
    const snesId = memoryjs
        .getProcesses()
        .find(proc => proc.szExeFile.includes('snes'))
        .th32ProcessID;
    const process = memoryjs.openProcess(snesId);
    const handle = process.handle;
    const snesMod = memoryjs.getModules(snesId)
        .find(mod => mod.szModule.includes('snes'));
    const baseAddress = snesMod.modBaseAddr;
    return {
        handle,
        baseAddress
    };
};

/**
 * this function will write do a 1-depth pointer to the snes rom.
 */
const writeToPointer = (pointerAddress, offset, dataBuffer) => {

    const proc = openProcess();

    // read in a 4 byte pointer to find the address of the data we're looking for.
    // note, we're using a specific endian syntax to reverse the bytes read.
    const pointerToData = memoryjs.readBuffer(proc.handle, proc.baseAddress + pointerAddress, 4).readIntLE(0, 4);
    const pointerWithOffset = pointerToData + offset;

    // finally write it out
    memoryjs.writeBuffer(proc.handle, pointerWithOffset, dataBuffer);
}

const isNumeric = (str) => {
    if (typeof str != "string")
        return false
    return !isNaN(str) && !isNaN(parseFloat(str)) 
}



