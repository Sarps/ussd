import {ProcessOutput} from "@/ProcessOutput";

const xpath = require('xpath')
import { Text } from  '@/xml/Text'
const {extract, formatText} = require('~/helpers')

export class DynamicOption extends Text {

    items = null;
    value = null;
    view = '';

    static fromXml(node: any) {
        const v = new DynamicOption()
        v.value = node.getAttribute('value')
        v.view = node.getAttribute('view')
        v.items = node.getAttribute('items') // TODO: Check for variable existence
        v.text = xpath.select('.//text()', node).reduce((acc: string, cur: string) => acc + cur, '')
        return v;
    }

    process(data: object): Array<ProcessOutput> {
        const items: [] = extract(data, this.items),
            _self = this
        return items ? items.map((item: any) => {
            const [po] = super.process({...data, item})
            po.view = _self.view
            po.value = formatText(_self.value, {...data, item})
            return po
        }) : []
    }

}