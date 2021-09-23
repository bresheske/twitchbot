/**
 * contains logic to store feature-flags.
 */

const path = require('path');
const fs = require('fs');
const filePath = path.join(process.cwd(), 'switches.json');

const getData = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(filePath).toString());
};

const saveSwitch = (sw) => {
    const data = getData();
    const previousSwitch = data.find(d => d.name === sw.name);
    if (previousSwitch) {
        previousSwitch.value = sw.value;
    }
    else {
        data.push(sw);
    }
    fs.writeFileSync(filePath, JSON.stringify(data));
};

const getSwitch = (name) => {
    const data = getData();
    const sw = data.find(d => d.name === name);
    return sw;
};

const isSwitchOn = (name) => {
    const sw = getSwitch(name);
    if (!sw)
        return false;
    if (sw.value !== true)
        return false;
    return true;
};

const toggleSwitch = (name) => {
    const sw = getSwitch(name) || { name, value: false };
    sw.value = !sw.value;
    saveSwitch(sw);
};

const getAll = () => {
    return getData();
};

module.exports = {
    isSwitchOn,
    toggleSwitch,
    getAll
};