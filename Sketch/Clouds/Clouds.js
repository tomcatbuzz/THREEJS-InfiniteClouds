import {ShaderMaterial, TextureLoader, Vector4, PlaneGeometry, InstancedBufferAttribute, DoubleSide, AdditiveBlending, Vector3, InstancedBufferGeometry, Mesh } from "three";

import Sketch from "../Sketch";

import env from '/img/env.png'
import clouds from '/img/clouds.png'

export default class Clouds {
    constructor(index) {
        this.sketch = new Sketch();
        this.scene = this.sketch.scene;
        this.sizes = this.sketch.sizes;
        this.index = 0;

        this.createClouds();
    }

    createClouds() {
        const material = new ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: DoubleSide,
            uniforms: {
                time: { value: 0 },
                progress: { value: 0 },
                t1: { value: new TextureLoader().load(env) },
                t2: { value: new TextureLoader().load(clouds) },
                resolution: { value: new Vector4() },
            },
            transparent: true,
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying float vAlpha;
                uniform vec2 pixels;
                attribute vec3 translate;
                attribute float aRotate;
                
                mat4 rotationMatrix(vec3 axis, float angle) {
                    axis = normalize(axis);
                    float s = sin(angle);
                    float c = cos(angle);
                    float oc = 1.0 - c;
                    
                    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                                0.0,                                0.0,                                0.0,                                1.0);
                }
                
                vec3 rotate(vec3 v, vec3 axis, float angle) {
                    mat4 m = rotationMatrix(axis, angle);
                    return (m * vec4(v, 1.0)).xyz;
                }
                
                float PI = 3.141592653589793238;
                void main() {
                // create random on this value + 0.33 to change in sprite
                vUv = (uv - vec2(0.5))/3. + vec2(0.5 + 0.33, 0.5);
                
                float depth = 5.;
                // original uv before 6image file using cloud2 nice
                // vUv = uv;
                vec3 newpos = position;
                
                newpos = rotate(newpos, vec3(0., 0., 1.), aRotate);
                newpos += translate;
                newpos.z = -mod(newpos.z - time*0.01, 5.);
                // calculate distance
                vPosition = newpos;
                vAlpha = smoothstep(-5. +3.5, -4. +3.5, newpos.z);
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newpos, 1.0 );
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float progress;
                uniform sampler2D t1;
                uniform sampler2D t2;
                uniform vec4 resolution;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                float PI = 3.141592653589793238;
                varying float vAlpha;
                void main()	{
                
                    vec3 color = vec3(0., 0.000, 139.);
                    
                    // vec4 map = texture2D(t1, vUv);
                    vec4 map = texture2D(t1, vUv);
                    vec4 map2 = texture2D(t2, vUv);
                
                    if(map.r < 0.03) discard;
                    if(map2.r < 0.03) discard;
                
                    // vec3 final = color*map.r;
                    vec3 final = mix(vec3(1.), color, 1. - map.r) + mix(vec3(1.), color, 1. - map2.r);
                    // values below were 0.5 and 1
                    float opacity = smoothstep(0.5, 1., length(vPosition.xy));
                    gl_FragColor = vec4(vUv, 0.0, vAlpha);
                    gl_FragColor = vec4(final, vAlpha*opacity*0.2);
                }
            `,
            depthTest: true,
            depthWrite: false,
            // blending: CustomBlending
            blending: AdditiveBlending // AdditiveBlending has a better result
        });

        const geometry = new PlaneGeometry(0.5, 0.5, 1, 1);

        const ig = new InstancedBufferGeometry();
        ig.attributes = geometry.attributes;
        ig.index = geometry.index;

        const number = 700;
        const translateArray = new Float32Array(number * 3);
        const rotateArray = new Float32Array(number);

        const radius = 0.7;

        // use map to create a grid of points
        const points = new Array(number).fill().map((_) => {
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = Math.random() * 5;

            return new Vector3(x, y, z);
        });

        // use points
        points.forEach((point, i) => {
            translateArray[i * 3] = point.x;
            translateArray[i * 3 + 1] = point.y;
            translateArray[i * 3 + 2] = point.z;

            rotateArray[i] = Math.random() * Math.PI * 2;
        });

        ig.setAttribute('translate', new InstancedBufferAttribute(translateArray, 3));
        ig.setAttribute('aRotate', new InstancedBufferAttribute(rotateArray, 1));

        const plane = new Mesh(ig, material);
        this.scene.add(plane);
    }

    update() {
        this.index++; // or this.index-- to reverse the animation
        this.index = this.index % 1000;

        this.scene.children[0].material.uniforms.time.value = this.index;
    }
}