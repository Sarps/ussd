
import { ProcessOutput } from  '@/ProcessOutput'

export class Node {

    static fromXml(node: any) {
        throw new Error('Not implemented')
    }

    process(data: any): Array<ProcessOutput> {
        throw new Error('Not implemented')
    }
}