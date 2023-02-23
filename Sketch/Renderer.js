import { WebGLRenderer, sRGBEncoding, CineonToneMapping, PCFSoftShadowMap } from "three";

import Sketch from "./Sketch";

export default class Renderer {
    constructor() {
        this.sketch = new Sketch();
        this.canvas = this.sketch.canvas;
        this.sizes = this.sketch.sizes;
        this.scene = this.sketch.scene;
        this.camera = this.sketch.camera;

        this.setInstance();
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = sRGBEncoding
        this.instance.toneMapping = CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = PCFSoftShadowMap
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}