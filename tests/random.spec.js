const pickOneOf = require('../utils/random/pickOneOf');

describe(`pickOneOf tests`, () => {
    it(`should pick one from small array`, () => {
        const items = [1, 2, 3];
        const result = pickOneOf(items);
        expect(items).toContain(result);
    });
    it(`should return undefined with no data`, () => {
        expect(pickOneOf(undefined)).toEqual(undefined);
        expect(pickOneOf([])).toEqual(undefined);
    });
});