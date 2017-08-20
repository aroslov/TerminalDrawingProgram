import {TerminalDrawer} from "./drawer";
import {Rectangle} from "./models/rectangle";
import {Point} from "./models/point";
import {assertPositive} from "./utils";
import {Canvas} from "models/canvas";
import {Line} from "models/line";

const CANVAS_RE = /^\s*C\s+(\d+)\s+(\d+)\s*$/i;
const LINE_RE = /^\s*L\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/i;
const RECTANGLE_RE = /^\s*R\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/i;
const FILL_RE = /^\s*B\s+(\d+)\s+(\d+)\s+(\w)\s*$/i;
const QUIT_RE = /^\s*Q\s*$/i;

export class InputController {
    previousInputs: Array<string> = [];
    lastInputIndex = -1;
    unfinishedInput: string;
    readonly commands: Array<any> = [
        {
            re: CANVAS_RE,
            func: this.onCanvas
        },
        {
            re: LINE_RE,
            func: this.onLine
        },
        {
            re: RECTANGLE_RE,
            func: this.onRectangle
        },
        {
            re: FILL_RE,
            func: this.onFill
        },
        {
            re: QUIT_RE,
            func: this.onQuit
        },
    ]

    constructor(private drawer: TerminalDrawer) {
        drawer.onSubmitInput(this.processUserInput);
        drawer.onInputKey('up', this.onKeyUp);
        drawer.onInputKey('up', this.onKeyDown);
    }

    public start() {
        this.drawer.drawPrompt('Enter command: ');
        this.drawer.drawHelp();
    }

    processUserInput(text: string) : void {
        this.drawer.setErrorText('');
        this.storePreviousInput(text);
        try {
            if (!this.commands.find(c => this.checkAndRunCommand(text, c.re, c.func)))
                this.drawer.setErrorText('Unrecognized input!')
        }
        catch(e) {
            this.drawer.setErrorText(e);
        }
        this.drawer.setUserInputValue();
    }

    checkAndRunCommand(input: string, re: RegExp, command: (parameters: Array<string>) => void) : boolean {
        let match = input.match(re);
        if (!match) return false;
        match.shift();
        command(match);
        return true;
    }

    onKeyUp() : void {
        if (this.unfinishedInput === null) {
            this.unfinishedInput = this.drawer.getInputValue();
        }
        if (this.lastInputIndex < 0) return;
        this.showPreviousInput(this.lastInputIndex);
        if (this.lastInputIndex) this.lastInputIndex--;
    }

    onKeyDown() : void {
        if (this.lastInputIndex >= this.previousInputs.length - 1) {
            if (this.unfinishedInput !== null)
                this.drawer.setUserInputValue(this.unfinishedInput);
            this.unfinishedInput = null;
            return;
        }
        this.lastInputIndex++;
        this.showPreviousInput(this.lastInputIndex);
    }

    storePreviousInput(text: string): void {
        this.previousInputs.push(text);
        this.lastInputIndex = this.previousInputs.length - 1;
        this.unfinishedInput = null;
    }

    showPreviousInput(index: number): void {
        this.drawer.setUserInputValue(this.previousInputs[this.lastInputIndex]);
    }

    onCanvas(parameters: Array<string>) {
        let width = Number(parameters[0]);
        let height = Number(parameters[1]);
        if (!width)
            throw `Canvas width must be a positive number`;
        if (!height)
            throw `Canvas height must be a positive number`;
        let maxWidth = this.drawer.getMaxWidth() - 2;
        let maxHeight = this.drawer.getMaxHeight() - 2;
        if (width > maxWidth)
            throw `New canvas width (${width}) is greater than maximum possible width (${maxWidth})`;
        if (height > maxHeight)
            throw `New canvas height (${height}) is greater than maximum possible height (${maxHeight})`;
        this.drawer.drawCanvas(new Canvas(width, height));
    }

    onLine(parameters: Array<string>) {
        let x1 = Number(parameters[0]);
        let y1 = Number(parameters[1]);
        let x2 = Number(parameters[2]);
        let y2 = Number(parameters[3]);
        assertPositive(x1, "Line's x1 coordinate");
        assertPositive(y1, "Line's y1 coordinate");
        assertPositive(x2, "Line's x2 coordinate");
        assertPositive(y2, "Line's y2 coordinate");
        this.drawer.drawLine(new Line(x1, y1, x2, y2));
    }

    onRectangle(parameters: Array<string>) {
        let x1 = Number(parameters[0]);
        let y1 = Number(parameters[1]);
        let x2 = Number(parameters[2]);
        let y2 = Number(parameters[3]);
        assertPositive(x1, "Line's x1 coordinate");
        assertPositive(y1, "Line's y1 coordinate");
        assertPositive(x2, "Line's x2 coordinate");
        assertPositive(y2, "Line's y2 coordinate");
        this.drawer.drawRectangle(new Rectangle(x1, y1, x2, y2));
    }

    onFill(parameters: Array<string>) {
        let x = Number(parameters[0]);
        let y = Number(parameters[1]);
        let c = parameters[2];
        assertPositive(x, "Point's x coordinate");
        assertPositive(y, "Point's y coordinate");
        this.drawer.fill(new Point(x, y), c);
    }

    onQuit() {
        this.drawer.cleanup();
        process.exit(0);
    }

}
