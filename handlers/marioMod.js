const doOneEvery = require('../utils/timers/doOneEvery');
const memoryjs = require('memoryjs');

/**
 * a silly handler which listens to commands and injects data into SNES9x memory.
 */
module.exports = (channel, tags, message, self, client, options) => {

    const tolower = message.toLowerCase();

    if (tolower.startsWith('!time'))
        handleTime(channel, tags, message, self, client, options);
        
    return;
}


const handleTime = (channel, tags, message, self, client, options) => {

    // grab the time to set.
    const timeToSet = message.split(' ')[1];
    if (!timeToSet || timeToSet.length !== 3 || !isNumeric(timeToSet)) {
        client.say(channel, `@${tags.username} !time <3-digit number>.`);
        return;
    }

    // grab the processID from SNES9x (or the first 'snes' application)
    const snesId = memoryjs
        .getProcesses()
        .find(proc => proc.szExeFile.includes('snes'))
        .th32ProcessID;

    // open the process for read/write
    const process = memoryjs.openProcess(snesId);
    const handle = process.handle;

    // here's our memory locations for the SMW timer.
    // these are 3 bytes for the hundred, tens, and ones values.
    // a bit of a strange way to store a number honestly.
    // note: these are hex literals, but in nodejs they exist as just numbers.
    const timerHundred = 0x04273EA1;
    const timerTens = 0x04273EA2;
    const timerOnes = 0x04273EA3;

    // convert our string of numbers into an array of hex values.
    const timeNumbers = timeToSet
        .split('')
        .map(digit => parseInt(digit));

    memoryjs.writeMemory(handle, timerHundred, timeNumbers[0], 'byte');
    memoryjs.writeMemory(handle, timerTens, timeNumbers[1], 'byte');
    memoryjs.writeMemory(handle, timerOnes, timeNumbers[2], 'byte');

    client.say(channel, `@${tags.username} timer set to ${timeToSet}!`);
};

const isNumeric = (str) => {
    if (typeof str != "string")
        return false
    return !isNaN(str) && !isNaN(parseFloat(str)) 
}