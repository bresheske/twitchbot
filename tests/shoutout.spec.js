const shoutout = require('../handlers/shoutout');
const mockClient = require('./utils/client');

describe(`shoutout tests`, () => {

    beforeEach(() => mockClient.reset());
    afterEach(() => mockClient.reset());

    it(`should not shoutout`, () => {
        shoutout(null, {username: 'user'}, 'hello', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toBeUndefined();
    });

    it(`should display usage message`, () => {
        shoutout(null, {username: 'user'}, '!so', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('Usage:');
    });

    it(`should shout out without @`, () => {
        shoutout(null, {username: 'user'}, '!so bucket_bot', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('twitch.tv/bucket_bot');
    });

    it(`should shout out with @`, () => {
        shoutout(null, {username: 'user'}, '!so @bucket_bot', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('twitch.tv/bucket_bot');
    });

    it(`should shout out with @@`, () => {
        shoutout(null, {username: 'user'}, '!so @@bucket_bot', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('twitch.tv/bucket_bot');
    });

});