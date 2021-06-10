const vscode =window['vscode'];
const postMessage = (message:any) => { if (vscode) { vscode.postMessage(message) } }

export const getVscodeEvent = () => {
    let events = {}
    let init:boolean = false;
    function receive({ data }) {
        if (!data || !data.type)
            return;
        if (events[data.type]) {
            events[data.type](data.content);
        }
    }
    return {
        on(event:string, callback) {
            this.tryInit();
            events[event] = callback
            return this;
        },
        emit(event:string, data:any) {
            this.tryInit();
            postMessage({ type: event, content: data })
        },
        tryInit() {
            if (init) return;
            init = true;
            window.addEventListener('message', receive)
        },
        destroy() {
            window.removeEventListener('message', receive)
            init = false;
        }
    }
}

