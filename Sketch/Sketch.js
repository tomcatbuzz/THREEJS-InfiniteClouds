// npm import
import { Scene } from "three"

// Local import
import Camera from "./Camera"
import Renderer from "./Renderer"
import Clouds from "./Clouds/Clouds"

// Utils import
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"

let INSTANCE = null

export default class Sketch {
    constructor(CANVAS) {
        if (INSTANCE) return INSTANCE
        INSTANCE = this

        // Global access
        window.sketch = this

        // Options
        this.canvas = CANVAS,
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.clouds = new Clouds()

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.renderer.update()
    }
}