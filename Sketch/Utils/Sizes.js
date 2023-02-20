import EventDispatcher from './EventDispatcher.js'

export default class Sizes extends EventDispatcher {
    constructor() {
        super()

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        window.addEventListener('resize', () => {     
            this.dispatch('resize', this.width, this.height, this.pixelRatio)
        })
    }
}