// returns one of the objects in the array, at random.
module.exports = (array) => {
    if (!array)
        return undefined;
    return array[Math.floor(Math.random()*array.length)];
};