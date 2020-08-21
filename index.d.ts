
import RouteParser = require('route-parser');
import { EventEmitter } from 'events';

declare namespace UssdML {

    interface ChoiceChildMap {
        option: Option,
        'dynamic-option': DynamicOption
    }

    interface ProcessOutput {
        text: string
        input?: string
        view?: string
        key?: string
        value?: string
    }

    interface RendererConfig {
        storageName: string
        storageOptions: string
        customStorage: Storage
        viewDir: string
        controllerMethods: Map<string, Function>
    }

    interface ViewChildMap {
        choice: Choice,
        text: Text,
        input: Input
    }

    class Choice extends Node {
        public children: Array<Option|DynamicOption>
        public trimContent: boolean
        public key: string
        static childMap: ChoiceChildMap
        static fromXml() : Choice
        public process(data: any): Array<ProcessOutput>
    }

    class DynamicOption extends Text {
        items: string
        view: string
        value: string
        static fromXml() : DynamicOption
        public process(data: any): Array<ProcessOutput>
    }

    class Input extends Text {
        items: string
        view: string
        value: string
        static fromXml() : Input
        public process(data: any): Array<ProcessOutput>
    }

    abstract class Node {
        constructor()
        static fromXml() : Node
        public process(data: any): ProcessOutput|Array<ProcessOutput>
    }

    class Option extends Text {
        view: string
        value: string
        static fromXml() : Option
        public process(data: any): ProcessOutput
    }

    class Renderer extends EventEmitter {
        init(config: RendererConfig): void
    }

    class Route {
        view: string
        domain: string
        route: RouteParser
        constructor();
        static fromXml() : Route;
        public matches(domain: string, route: string): boolean;
    }

    abstract class Storage {
        setup(): void
        addRoute(phone: string, sessionId: string, route: string): void
        getCurrentRoute(sessionId: string): string
        popRoute(sessionId: string): void
    }

    class Text extends Node {
        public text: string
        static fromXml() : Text
    }

    class View<T extends Node> extends Node {
        public name: string
        public controllerMethod: string
        private _backAllowed: boolean
        children: Array<T>
        static childMap: ViewChildMap
        static fromXml() : View<Node>
        public process(data: any): Array<ProcessOutput>
    }

    class UssdRequest {
        text: string
        phone: string
        network: string
        session: string
        ussd: string
        get isNew(): boolean
    }

}

export = UssdML