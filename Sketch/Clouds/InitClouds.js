import Sketch from '../Sketch'
import Clouds from './Clouds'

export default class InitClouds {
    constructor() {
        this.sketch = new Sketch()
        this.scene = this.sketch.scene

        this.clouds = new Clouds()
    }

    // Foward methods from Clouds
    update() {
        this.clouds.update()
    }
}