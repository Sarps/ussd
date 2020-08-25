
import { Renderer } from './Renderer';
import { UssdRequest } from './models/UssdRequest';

const k = new Renderer()

export default {
    render: k.render.bind(k),
    init: k.init.bind(k),
    process: k.process.bind(k),
    UssdRequest
}