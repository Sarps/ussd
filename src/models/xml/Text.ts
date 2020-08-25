const xpath = require('xpath')
import { Node } from  '@/xml/Node'
import { ProcessOutput } from  '@/ProcessOutput'
const {formatText} = require('../../helpers')

export class Text extends Node {

    text = ''

    static fromXml(node: any) {
        const v = new Text()
        v.text = xpath.select('.//text()', node).reduce((acc: string, cur: string) => acc + cur, '')
        return v;
    }

    process(data: any): Array<ProcessOutput> {
        const po = new ProcessOutput()
        po.text = formatText(this.text, data)
        return [po];
    }

}