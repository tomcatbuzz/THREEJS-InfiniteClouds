export default class EventDispatcher {
    constructor() {
        this.callbacks = {}
    }

    on(event, callback) {
        if (this.callbacks[event] === undefined) this.callbacks[event] = []
        this.callbacks[event].push(callback)
    }

    off(event, callback) {
        if (this.callbacks[event] !== undefined) {
            this.callbacks[event] = this.callbacks[event].filter(
                (item) => item !== callback
            )
        }
    }

    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args)
            this.off(event, onceCallback)
        }
        this.on(event, onceCallback)
    }

    dispatch(event, ...args) {
        if (this.callbacks[event] !== undefined) {
            for (const callback of this.callbacks[event]) {
                callback(...args)
            }
        }
    }

    destroy() {
        this.callbacks = {}
    }
}