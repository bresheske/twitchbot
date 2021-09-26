const doOneEvery = require('../utils/timers/doOneEvery');
const memoryjs = require('memoryjs');
const wordwrap = require('wordwrap');
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
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0019, Buffer.from([0x02])));
    else if (tolower.startsWith('!flower'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0019, Buffer.from([0x03])));
    else if (tolower.startsWith('!star'))
        handleStar(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!big'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0019, Buffer.from([0x01])));
    else if (tolower.startsWith('!small'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0019, Buffer.from([0x00])));
    else if (tolower.startsWith('!pswitch'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E14AD, Buffer.from([0xFF])));
    else if (tolower.startsWith('!spswitch'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E14AE, Buffer.from([0xFF])));
    else if (tolower.startsWith('!mariomod'))
        handleHelp(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!kaizo'))
        handleKaizo(channel, tags, message, self, client, options);
    else if (tolower.startsWith('!water'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0085, Buffer.from([0x01])));
    else if (tolower.startsWith('!land'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0085, Buffer.from([0x00])));
    else if (tolower.startsWith('!ice'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0086, Buffer.from([0xFF])));
    else if (tolower.startsWith('!thaw'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => writeToSWMAddress(0x007E0086, Buffer.from([0x00])));
    else if (tolower.startsWith('!pballoon'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => {
            // writeToSWMAddress(0x007E13F3, Buffer.from([0x09]));
            // writeToSWMAddress(0x007E1891, Buffer.from([0xFF]));
        });
    else if (tolower.startsWith('!kickright'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => {
            writeToSWMAddress(0x007E007B, Buffer.from([0x7F]));
            writeToSWMAddress(0x007E007D, Buffer.from([0x80]));
        });
    else if (tolower.startsWith('!kickleft'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => {
            writeToSWMAddress(0x007E007B, Buffer.from([0x80]));
            writeToSWMAddress(0x007E007D, Buffer.from([0x80]));
        });
    else if (tolower.startsWith('!messagebox'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => {
            handleMessage(channel, tags, message, self, client, options);
        });
    else if (tolower.startsWith('!offset'))
        switches.runIfSwitchIsOn(SWITCH_KEY, () => {
            const offset = convertSMWCentralAddressToReal(0x0);
            client.say(channel, `The current offset is :${offset.toString(16)}.`)
        });
    return;
}

const handleHelp = (channel, tags, message, self, client, options) => {
    const status = switches.isSwitchOn(SWITCH_KEY);
    let out = `@${tags.username} MarioMod is currently set to ${status ? 'ON' : 'OFF'}.`;
    if (status)
        out += `  List of fun commands you have access to: !cape, !flower, !star, !big, !small, !pswitch, !spswitch, !water, !land, !ice, !thaw, !kickright, !kickleft, !time <3-digit time>`;
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

const handleMessage = (channel, tags, message, self, client, options) => {
    const text = message.substring(message.indexOf(' ') + 1);
    if (!text || text.length === 0) {
        client.say(channel, `@${tags.username} !message <message text>.`);
        return;
    }

    const data = Buffer.from(convertTextToSMWMessage(text, tags.username));

    // here's the pointer and offset to the location of the data for world 1.
    // writeToPointer(0x8D8EF8, 0xA968, data);
    // TODO: We need to find the offset based on... perhaps the level number. 
    //       Not sure how we can do that just yet.
    writeToPointer(0x8D8EF8, 0xAAF1, data);

    // this is the trigger to show messagebox-1 for a level.
    writeToSWMAddress(0x007E1426, Buffer.from([0x01]));
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

    


    // -------------------------------

};

/**
 * this function converts any string of text into an array of bytes that map to
 * the Layer3 text values in vanilla SMW.
 */
const convertTextToSMWMessage = (message, username) => {

    // append a username to the message and word-wrap it.
    let userMessage = message + ` -${username}`;
    let wrapped = wordwrap(18)(userMessage);

    // now we need to convert the newline characteres into spaces, but
    // the number of spaces depends on current column count (up to 18.)
    let columnIndex = 0;
    let builtString = '';
    for (let i = 0; i < wrapped.length; i++) {
        if (wrapped[i] === '\n') {
            const spaces = ' '.repeat(18 - columnIndex);
            builtString += spaces;
            columnIndex = 0;
        }
        else {
            builtString += wrapped[i];
            columnIndex++;
        }
    }

    // i am certain there's a better way to do this.
    // but this is easy to read.
    // stop judging me dammit.
    const map = [
        { char: 'A', hex: 0x00 },
        { char: 'B', hex: 0x01 },
        { char: 'C', hex: 0x02 },
        { char: 'D', hex: 0x03 },
        { char: 'E', hex: 0x04 },
        { char: 'F', hex: 0x05 },
        { char: 'G', hex: 0x06 },
        { char: 'H', hex: 0x07 },
        { char: 'I', hex: 0x08 },
        { char: 'J', hex: 0x09 },
        { char: 'K', hex: 0x0A },
        { char: 'L', hex: 0x0B },
        { char: 'M', hex: 0x0C },
        { char: 'N', hex: 0x0D },
        { char: 'O', hex: 0x0E },
        { char: 'P', hex: 0x0F },
        { char: 'Q', hex: 0x10 },
        { char: 'R', hex: 0x11 },
        { char: 'S', hex: 0x12 },
        { char: 'T', hex: 0x13 },
        { char: 'U', hex: 0x14 },
        { char: 'V', hex: 0x15 },
        { char: 'W', hex: 0x16 },
        { char: 'X', hex: 0x17 },
        { char: 'Y', hex: 0x18 },
        { char: 'Z', hex: 0x19 },
        { char: '!', hex: 0x1A },
        { char: '.', hex: 0x1B },
        { char: '-', hex: 0x1C },
        { char: ',', hex: 0x1D },
        { char: '?', hex: 0x1E },
        { char: ' ', hex: 0x1F },
        { char: 'a', hex: 0x40 },
        { char: 'b', hex: 0x41 },
        { char: 'c', hex: 0x42 },
        { char: 'd', hex: 0x43 },
        { char: 'e', hex: 0x44 },
        { char: 'f', hex: 0x45 },
        { char: 'g', hex: 0x46 },
        { char: 'h', hex: 0x47 },
        { char: 'i', hex: 0x48 },
        { char: 'j', hex: 0x49 },
        { char: 'k', hex: 0x4A },
        { char: 'l', hex: 0x4B },
        { char: 'm', hex: 0x4C },
        { char: 'n', hex: 0x4D },
        { char: 'o', hex: 0x4E },
        { char: 'p', hex: 0x4F },
        { char: 'q', hex: 0x50 },
        { char: 'r', hex: 0x51 },
        { char: 's', hex: 0x52 },
        { char: 't', hex: 0x53 },
        { char: 'u', hex: 0x54 },
        { char: 'v', hex: 0x55 },
        { char: 'w', hex: 0x56 },
        { char: 'x', hex: 0x57 },
        { char: 'y', hex: 0x58 },
        { char: 'z', hex: 0x59 },
        { char: '0', hex: 0x22 },
        { char: '1', hex: 0x23 },
        { char: '2', hex: 0x24 },
        { char: '3', hex: 0x25 },
        { char: '4', hex: 0x26 },
        { char: '5', hex: 0x27 },
        { char: '6', hex: 0x28 },
        { char: '7', hex: 0x29 },
        { char: '8', hex: 0x2A },
        { char: '9', hex: 0x2B },
    ];

    
    let messageBytes = builtString.split('').map(c => {
        const foundMap = map.find(m => m.char === c);
        return foundMap ? foundMap.hex : 0x1F;
    });
    
    // write out spaces to fill the data to the end.
    while (messageBytes.length < 144)
        messageBytes.push(0x1F);

    return messageBytes;
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

