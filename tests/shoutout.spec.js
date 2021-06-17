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

});