const followBan = require('../handlers/followBan');
const mockClient = require('./utils/client');

describe(`followBan tests`, () => {

    beforeEach(() => mockClient.reset());
    afterEach(() => mockClient.reset());

    it(`should not ban user - base case`, () => {
        followBan(null, {username: 'user'}, 'hi', null, mockClient);
        expect(mockClient.getMessages().length).toBe(0);
    });

    it(`should not ban user - not streamlabs.`, () => {
        followBan(null, {username: 'user'}, 'Thank you for following hoss!', null, mockClient);
        expect(mockClient.getMessages().length).toBe(0);
    });

    it(`should not ban user - not hoss.`, () => {
        followBan(null, {username: 'streamlabs'}, 'Thank you for following boss!', null, mockClient);
        expect(mockClient.getMessages().length).toBe(0);
    });

    it(`should ban user - hoss.`, () => {
        followBan(null, {username: 'streamlabs'}, 'Thank you for following hoss!', null, mockClient);
        expect(mockClient.getMessages()[0]).toBe('/ban hoss');
    });

    it(`should ban user - manofsteel.`, () => {
        followBan(null, {username: 'streamlabs'}, 'Thank you for following ManOfSteel0001!', null, mockClient);
        expect(mockClient.getMessages()[0]).toBe('/ban ManOfSteel0001');
    });


});