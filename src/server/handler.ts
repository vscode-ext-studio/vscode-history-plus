import { EventEmitter } from 'events'
import { WebviewPanel } from "vscode";

export class Hanlder {

    private eventEmitter: EventEmitter;
    constructor(public panel: WebviewPanel,) {
        this.eventEmitter = new EventEmitter();
        panel.webview.onDidReceiveMessage((message) => {
            if (message.type) {
                this.eventEmitter.emit(message.type, message.content)
            }
        })
    }

    on(event: string, callback: (content: any) => void): this {
        this.eventEmitter.on(event, callback)
        return this;
    }

    emit(event: string, content?: any) {
        this.panel.webview.postMessage({ type: event, content })
    }

}
