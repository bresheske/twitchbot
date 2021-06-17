let messages = [];

module.exports = {
    say: (channel, message) => {
        messages.push(message);
    },
    getMessages: () => messages,
    reset: () => messages = []
};