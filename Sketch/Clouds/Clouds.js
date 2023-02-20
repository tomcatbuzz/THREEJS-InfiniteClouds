import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three'

import Sketch from '../Sketch'

export default class Clouds {
    constructor() {
        this.sketch = new Sketch()
        this.scene = this.sketch.scene
        
        const testMesh = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 0xff0000 })
        )
        this.scene.add(testMesh)
    }
}