import { Rectangle } from '../../src/models/rectangle';
import { expect } from 'chai';
import {Point} from "../../src/models/point";

describe('Rectangle', () => {
    it('should handle reversed rectangles', () => {
        const r = new Rectangle(4, 3, 2, 1);
        expect(r.x1).to.equal(2);
        expect(r.x2).to.equal(4);
        expect(r.y1).to.equal(1);
        expect(r.y2).to.equal(3);
    });
    it('should truncate rectangles', () => {
        let r = (new Rectangle(1, 2, 3, 4)).truncate(new Rectangle(5, 6, 7, 8));
        expect(r).to.equal(null);
        r = (new Rectangle(5, 6, 7, 8)).truncate(new Rectangle(1, 2, 3, 4));
        expect(r).to.equal(null);
        r = (new Rectangle(1, 2, 3, 4)).truncate(new Rectangle(2, 3, 4, 5));
        expect(r.x1).to.equal(2);
        expect(r.y1).to.equal(3);
        expect(r.x2).to.equal(3);
        expect(r.y2).to.equal(4);
        r = (new Rectangle(1, 2, 5, 6)).truncate(new Rectangle(3, 4, 8, 5));
        expect(r.x1).to.equal(3);
        expect(r.y1).to.equal(4);
        expect(r.x2).to.equal(5);
        expect(r.y2).to.equal(5);
        r = (new Rectangle(3, 4, 8, 5)).truncate(new Rectangle(1, 2, 5, 6));
        expect(r.x1).to.equal(3);
        expect(r.y1).to.equal(4);
        expect(r.x2).to.equal(5);
        expect(r.y2).to.equal(5);
    });
    it('checks if point is on the border', () => {
        const r = new Rectangle(1, 2, 3, 4);
        expect(r.isOnTheBorder(new Point(1,2))).to.equal(true);
        expect(r.isOnTheBorder(new Point(3,4))).to.equal(true);
        expect(r.isOnTheBorder(new Point(1,3))).to.equal(true);
        expect(r.isOnTheBorder(new Point(3,3))).to.equal(true);
        expect(r.isOnTheBorder(new Point(2,2))).to.equal(true);
        expect(r.isOnTheBorder(new Point(2,4))).to.equal(true);
        expect(r.isOnTheBorder(new Point(2,3))).to.equal(false);
        expect(r.isOnTheBorder(new Point(3,5))).to.equal(false);
    });
});

