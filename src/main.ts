import {TerminalDrawer} from './drawer';
import {InputController} from "./controller";

let drawer = new TerminalDrawer();
let controller = new InputController(drawer);

controller.start();