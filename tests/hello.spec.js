const hello = require('../handlers/hello');
const mockClient = require('./utils/client');

describe(`hello tests`, () => {

    beforeEach(() => mockClient.reset());
    afterEach(() => mockClient.reset());

    it(`should say hello`, () => {
        hello(null, {username: 'user'}, '!hello', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('Yo');
        expect(message).toContain('@user');
    });

    it(`should not say hello`, () => {
        hello(null, {username: 'user'}, 'hello', null, mockClient);
        const message = mockClient.getMessages()[0];
        expect(message).toBeUndefined();
    });
});