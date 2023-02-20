// npm import
import { Scene } from "three"

// Local import
import Camera from "./Camera"
import InitClouds from "./Clouds/InitClouds"
import Renderer from "./Renderer"

// Utils import
import IsMobile from "./Utils/IsMobile"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"

let instance = null

export default class Sketch {
    constructor(CANVAS) {
        if (instance) return instance
        instance = this

        // Global access
        window.sketch = this

        // Options
        this.isMobile = new IsMobile().isMobile
        this.canvas = CANVAS,
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new Scene()
        this.clouds = new InitClouds()
        this.camera = new Camera()
        this.renderer = new Renderer()

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
        this.clouds.update()
        this.camera.update()
        this.renderer.update()
    }
}