import { Canvas } from '../../src/models/canvas';
import { expect } from 'chai';
import {Point} from "../../src/models/point";

describe('Canvas', () => {
   it('should fill the canvas', () => {
       let c = new Canvas(3,3);
       let fill = c.getFillPoints2(new Point(1,1));
       expect(fill.length).to.equal(9);
       expect(fill.find(p => p.equals(new Point(1,1)))).to.not.equal(null);
       expect(fill.find(p => p.equals(new Point(3,3)))).to.not.equal(null);
    });
});

