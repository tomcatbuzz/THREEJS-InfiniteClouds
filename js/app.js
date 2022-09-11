import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import * as dat from 'dat.gui';
import clouds from '../img/clouds.png';
import env from '../img/env.png';

import gsap from 'gsap';
import { Text } from 'troika-three-text'

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x0096FF, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // let frustumSize = 1;
    // this.camera = new THREE.OrthographicCamera(
    //   frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000
    // );

    // this setting disables orbit control below
    // this.camera.position.set(0, 0, 0);

    this.camera.position.set(0, 0, 0.1);
    this.camera.lookAt(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    // this.bgChange = 0;

    this.isPlaying = true;

    this.loader = new THREE.TextureLoader();

    this.index = 0;
    this.COLOR = new THREE.Color(0xA7C7E7);
    this.COLOR1 = new THREE.Color(0x008B8B);
    this.COLOR2 = new THREE.Color(0x0ADD8E6);
    this.COLOR3 = new THREE.Color(0x0096FF);
    this.COLOR4 = new THREE.Color(0xFFB6C1);
    this.colorArray = [this.COLOR, this.COLOR1, this.COLOR2, this.COLOR3, this.COLOR4]

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.point = new THREE.Vector3();

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();
    this.handleEvent();
  }

  settings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  // this.textures = loader.load([cloud, cloud2, cloud3, cloud4, cloud5, cloud6])

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        texture1: { value: null },
        t1: { value: new THREE.TextureLoader().load(env) },
        t2: { value: new THREE.TextureLoader().load(clouds) },
        resolution: { value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: true,
      depthWrite: false,
      // blending: THREE.CustomBlending
      blending: THREE.AdditiveBlending
    });
    this.geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1);

    this.ig = new THREE.InstancedBufferGeometry();
    console.log(this.ig, 'IG this')
    this.ig.attributes = this.geometry.attributes;
    console.log(this.ig.index, "wtf main")
    this.ig.index = this.geometry.index;

    let number = 1000;
    let translateArray = new Float32Array(number * 3);
    let rotateArray = new Float32Array(number);

    let radius = 0.7;

    for (let i = 0; i < number; i++) {
      let theta = Math.random() * 2 * Math.PI
      translateArray.set([
        radius * Math.sin(theta),
        radius * Math.cos(theta),
        -Math.random() * 5
      ], 3 * i)
      rotateArray.set([
        Math.random() * 2 * Math.PI,
      ], i)
    }

    this.ig.setAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3))
    this.ig.setAttribute('aRotate', new THREE.InstancedBufferAttribute(rotateArray, 1))

    this.plane = new THREE.Mesh(this.ig, this.material);
    this.scene.add(this.plane);

    const myText = new Text()
    this.scene.add(myText)

    // Set properties to configure:
    myText.text = 'Awesome'
    myText.fontSize = 1
    myText.anchorX = 'center'
    myText.position.z = -2
    myText.color = 0xFFFFFF

    // Update the rendering:
    myText.sync()
  }

  easeInExpo(t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  }

  isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  changeColor() {
    this.scene.background = this.colorArray[this.index]
    this.index = this.index >= this.colorArray.length - 1 ? 0 : this.index + 1;

    // use gsap to transition the color
    gsap.to(this.scene.background, {
      duration: 1,
      r: this.colorArray[this.index].r,
      g: this.colorArray[this.index].g,
      b: this.colorArray[this.index].b,
      ease: 'power4.out',
      onComplete: () => {
        this.scene.background = this.colorArray[this.index]
      }
    });
  }

  handleEvent() {
    const DEVICE = this.isMobile() ? true : false;
    const CLICKEVENT = DEVICE ? 'touchstart' : 'click';
    const MOVEEVENT = DEVICE ? 'touchmove' : 'mousemove';

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    window.addEventListener(CLICKEVENT, () => {
      this.changeColor();
    })

    window.addEventListener(MOVEEVENT, (e) => {
      const tick = ()=>{
        this.current = Date.now()
        this.elapsed = this.current - this.start
        this.delta = this.current - this.previous
        this.previous = this.current
        if(this.elapsed % 2000 < this.delta){
          this.changeColor();
          requestAnimationFrame(tick)
        }
      }; tick()
    })
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    // this.bgChange += 0.01;

    this.material.uniforms.time.value = this.time;
    this.material.uniforms.progress.value = this.settings.progress;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById('container')
});