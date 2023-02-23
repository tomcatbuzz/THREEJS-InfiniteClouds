import { Color } from 'three'
import gsap from 'gsap'

import Sketch from '../Sketch'
import Clouds from './Clouds'

export default class InitClouds {
    constructor() {
        this.sketch = new Sketch()
        this.scene = this.sketch.scene
        this.clouds = new Clouds()
        this.time = this.sketch.time
        this.isMobile = this.sketch.isMobile

        this.colors = {
            grey: 0xA7C7E7,
            turquoise: 0x008B8B,
            green: 0x0ADD8E,
            blue: 0x0096FF,
            pink: 0xFFB6C1,
        }

        this.colorsArray = Object.values(this.colors)
        this.handleEvent()
    }

    handleEvent() {
        const CLICK_EVENT = this.isMobile ? 'touchstart' : 'click'
        const MOVE_EVENT = this.isMobile ? 'touchmove' : 'mousemove'
        this.scene.background = new Color(this.colors.blue)

        window.addEventListener(CLICK_EVENT, () => {
            this.changeColor()
        })

        let lastMousePosition = null;
        let lastMouseTime = null;
        const distanceThreshold = 275; // Distance threshold to consider that the mouse has moved
        const timeThreshold = 1000; // Time threshold in milliseconds to consider that the mouse has moved
        window.addEventListener(MOVE_EVENT, (event)=> {
            const currentMousePosition = { x: event.clientX, y: event.clientY };
            const currentTime = Date.now();

            if (lastMousePosition == null) {
                lastMousePosition = currentMousePosition;
                lastMouseTime = currentTime;
                return;
            }

            const distance = Math.sqrt(
                Math.pow(currentMousePosition.x - lastMousePosition.x, 2) +
                Math.pow(currentMousePosition.y - lastMousePosition.y, 2)
            );

            const timeElapsed = currentTime - lastMouseTime;

            if (distance < distanceThreshold || timeElapsed < timeThreshold) {
                return;
            }

            // Look it's magic :)
            this.changeColor()

            lastMousePosition = currentMousePosition;
            lastMouseTime = currentTime;
        });
    }

    changeColor() {
        const color = this.colorsArray[Math.floor(Math.random() * this.colorsArray.length)]
        gsap.to(this.scene.background, {
            duration: 1,
            r: ((color >> 16) & 255) / 255,
            g: ((color >> 8) & 255) / 255,
            b: (color & 255) / 255,
        })
    }

    // Foward methods from Clouds
    update() {
        this.clouds.update()
    }
}