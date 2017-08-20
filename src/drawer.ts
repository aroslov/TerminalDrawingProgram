import blessed = require('blessed');
import {Rectangle} from "./models/rectangle";
import {Canvas} from "./models/canvas";
import {Point} from "./models/point";
import {Line} from "models/line";

export class TerminalDrawer {
    screen: any;
    input: any;
    inputLabel: any;
    helpBox: any;
    canvasBox: any;
    canvas: Canvas;

    constructor() {
         this.screen = blessed.screen({
            smartCSR: true
        });
    }

    drawPrompt(prompt: string) {
        let form = blessed.form({
            parent: this.screen,
            left: 0,
            bottom: 0,
            width: 30,
            height: 1,
            content: prompt
        });
        this.inputLabel = blessed.box({
            parent: this.screen,
            left: 0,
            bottom: 1,
            height: 1,
            width: '100%'
        });
        this.input = blessed.textbox({
            parent: form,
            left: prompt.length,
            bottom: 0,
            inputOnFocus: true
        });
        this.input.focus();
        this.screen.render();
    }

    drawHelp() {
        this.helpBox = blessed.box({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: 80,
            height: 14,
            content: 'DRAWING PROGRAM by Anton Roslov\n\nInstructions:\n' +
            'C w h           Create a new canvas of width w and height h.\n' +
            'L x1 y1 x2 y2   Create a new line from (x1,y1) to (x2,y2). Currently only\n' +
            '                horizontal or vertical lines are supported. Horizontal \n' +
            '                and vertical lines will be drawn using the \'x\' character.\n' +
            'R x1 y1 x2 y2   Create a new rectangle, whose upper left corner is (x1,y1) and\n' +
            '                lower right corner is (x2,y2). Horizontal and vertical lines\n' +
            '                will be drawn using the \'x\' character.\n' +
            'B x y c         Fill the entire area connected to (x,y) with "colour" c. The\n' +
            '                behaviour of this is the same as that of the "bucket fill" \n' +
            '                tool in paint programs.\n' +
            'Q               Quit the program.',
            style: {
                fg: 'black',
                bg: 'yellow',
            }
        });
        this.screen.render();
    }

    cleanup() {
        this.input.clearValue();
        this.input.left = 0;
        this.input.focus();
        this.screen.render();
    }

    drawLine(line : Line) {
        if (!(line.isHorizontal() || line.isVertical()))
            throw `Only horizontal and vertical lines are supported`;
        this.drawRectangle(line);
    }

    drawRectangle(rect : Rectangle) {
        if (!this.canvasBox)
            throw 'No canvas created, please create one first';
        let r = this.canvas.truncate(rect);
        if (!r)
            throw 'Rectangle is outside the canvas';
        blessed.box({
            parent: this.canvasBox,
            left: r.x1-1,
            top: r.y1-1,
            width: r.x2-r.x1+1,
            height: r.y2-r.y1+1,
            border: {
                type: 'bg',
                ch: 'x'
            },
            style: {
                border: {
                    fg: 'black',
                }
            }
        });
        this.canvas.addChild(rect);
        this.screen.render();
    }

    drawPoint(point: Point, color: string) {
        if (!this.canvasBox)
            throw 'No canvas created, please create one first';
        blessed.box({
            parent: this.canvasBox,
            left: point.x-1,
            top: point.y-1,
            width: 1,
            height: 1,
            border: {
                type: 'bg',
                ch: color
            },
            style: {
                border: {
                    fg: 'black',
                }
            }
        });
        this.screen.render();
    }

    drawCanvas(c: Canvas) {
        if (this.canvasBox)
            this.screen.remove(this.canvasBox);
        this.canvas = c;
        this.canvasBox = blessed.box({
            parent: this.screen,
            top: 0,
            left: 0,
            width: c.width+2,
            height: c.height+2,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: 'white',
                }
            }
        });
        this.screen.render();
    }

    public fill(point: Point, color: string) : void {
        let points = this.canvas.getFillPoints2(point);
        for (let point of points)
            this.drawPoint(point, color);
        this.screen.render();
    }

    setErrorText(error: string|Error) : void {
        if (error instanceof Error) {
            this.inputLabel.content = `${error.name} ${error.message}`;
        }
        else
            this.inputLabel.content = error;
        this.screen.render();
    }

    hideHelp() : void {
        this.screen.remove(this.helpBox);
        this.screen.render();
    }

    setUserInputValue(value?: string) : void {
        if (!value) this.input.clearValue();
        else this.input.setValue(value);
        this.input.focus();
        this.screen.render();
    }

    onSubmitInput(f : (value: string) => void) {
        this.input.on('submit', () => f(this.input.value));
    }

    onInputKey(key: string, f : () => void) {
        this.input.key(key, f);
    }

    getInputValue() : string {
        return this.input.value;
    }

    getMaxWidth() : number {
        return this.screen.width;
    }

    getMaxHeight() : number {
        return this.screen.height - 2;
    }
}