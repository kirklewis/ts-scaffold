import { expect } from "chai"
import { sumAll } from '../index'
// import * as sinon from 'sinon';

describe("Math", () => {
    it("Should return the sum of all numbers", () => {
        expect(sumAll(1, 2, 3)).to.equal(6);
        expect(sumAll(-1, -2, -3)).to.equal(-6);
    })
})