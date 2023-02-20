import { PerspectiveCamera } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Sketch from "./Sketch";

export default class Camera {
    constructor() {
        this.sketch = new Sketch();
        this.sizes = this.sketch.sizes
        this.scene = this.sketch.scene
        this.canvas = this.sketch.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, 0.1)
        this.instance.lookAt(0, 0, 2)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}