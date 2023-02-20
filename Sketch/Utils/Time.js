import EventDispatcher from "./EventDispatcher";

export default class Time extends EventDispatcher {
    constructor() {
        super();

        this.timestamp = Date.now();
        this.now = this.timestamp;
        this.elapsed = 0;
        // delta of 16ms ~= 60fps
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const CURRENT_TIME = Date.now();
        this.delta = CURRENT_TIME - this.timestamp;
        this.timestamp = CURRENT_TIME;
        this.elapsed = this.timestamp - this.now;

        this.dispatch('tick', this);

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

}