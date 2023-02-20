import EventDispatcher from "./EventDispatcher";

export default class Time extends EventDispatcher {
    constructor() {
        super();

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        // delta of 16ms ~= 60fps
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const CURRENT_TIME = Date.now()
        this.delta = CURRENT_TIME - this.current
        this.current = CURRENT_TIME
        this.elapsed = this.current - this.start

        this.dispatch('tick', this.delta, this.elapsed);

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

}