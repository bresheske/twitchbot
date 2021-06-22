const yo = require('../handlers/yo');
const mockClient = require('./utils/client');

describe(`yo tests`, () => {
    beforeEach(() => mockClient.reset());
    afterEach(() => mockClient.reset());

    const noDelayOptions = { delaySeconds: 0 };

    it(`yo - basic message`, () => {
        yo(null, {username: 'user'}, 'yo', null, mockClient, noDelayOptions);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('yo');
    });

    it(`no yo`, () => {
        yo(null, {username: 'user'}, 'yogurt', null, mockClient, noDelayOptions);
        const message = mockClient.getMessages()[0];
        expect(message).toBeUndefined();
    });

    it(`yo - basic message with no delay`, () => {
        yo(null, {username: 'user'}, 'yo', null, mockClient, noDelayOptions);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('yo');
    });

    it(`yo - basic message to a user`, () => {
        yo(null, {username: 'user'}, 'yo friendo', null, mockClient, noDelayOptions);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('yo');
    });

    it(`yo - with a capital Y`, () => {
        yo(null, {username: 'user'}, 'Yo friendo', null, mockClient, noDelayOptions);
        const message = mockClient.getMessages()[0];
        expect(message).toContain('yo');
    });


});
