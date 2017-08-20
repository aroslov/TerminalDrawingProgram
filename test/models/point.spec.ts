import { Point } from '../../src/models/point';
import { expect } from 'chai';

describe('Point', () => {
    it('should provide direct neighbours', () => {
        let p = new Point(4,5);
        expect(p.north()).to.deep.equal(new Point(4,4));
        expect(p.west()).to.deep.equal(new Point(5,5));
        expect(p.south()).to.deep.equal(new Point(4,6));
        expect(p.east()).to.deep.equal(new Point(3,5));
    });
    it('should provide all neighbours', () => {
        let p = new Point(4,5);
        expect(p.neighbours()).to.deep.equal([
            new Point(4,4),
            new Point(5,5),
            new Point(4,6),
            new Point(3,5)
        ])
    });
    it('compares to other points', () => {
        expect((new Point(4,5)).equals(new Point(4,5))).to.equal(true);
        expect((new Point(4,5)).equals(new Point(4,6))).to.equal(false);
        expect((new Point(4,5)).equals(new Point(5,5))).to.equal(false);
        expect((new Point(4,5)).equals(new Point(5,6))).to.equal(false);
    });
});

