module.exports = {
    isUserStreamerOrMod: (tags) => {
        return tags?.badges?.broadcaster === '1' || tags?.mod === true;
    }
};