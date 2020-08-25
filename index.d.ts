
import RouteParser = require('route-parser');
import Loki = require('lokijs')
import { EventEmitter } from 'events';

declare namespace UssdML {

    interface ChoiceChildMap {
        option: Option,
        'dynamic-option': DynamicOption
    }

    interface MemoryStorageConfig {
        file: string
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

    interface RenderOutput {
        text: string
        inputs: {string: string}
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

    class MemoryStorage {
        db: Loki
        routeCollection: Loki.Collection
        constructor(options: MemoryStorageConfig)
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
        private _views: {string: View<Node>}
        private _routes: Array<Route>
        private _methods: Map<string, Function>
        storage: Storage
        static _s: {string: Storage}
        init(config: RendererConfig): void
        render(view: string, data: object): string
        process(request: UssdRequest): {textResponse: string, open: boolean}

        private _doRender(viewName: string, data: object): RenderOutput
        private _initStorage({storageName, storageOptions, customStorage}): Promise<void>
        private _initViews({viewDir: dir}): Promise<void>
        private _parseRoute(route: string): {view: string, inputs: object, data: object}
        private _matchInput(inputs: RenderOutput["inputs"], text: string): {view: string, key: string, value: string}
    }

    class Route {
        view: string
        domain: string
        route: RouteParser
        constructor();
        static fromXml() : Route;
        public matches(domain: string, route: string): boolean;
    }

    class RouteBuilder {
        static ROUTE_SEPARATOR: string;
        static INPUT_SEPARATOR: string;
        inputs: Map<string, string>;
        data: Map<string, string>;
        input: string;
        static parse(route: string): RouteBuilder;
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