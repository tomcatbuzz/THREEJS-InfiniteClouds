import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import * as dat from 'dat.gui';
import brush from '../img/brush-stroke2.png';
import cloud from '../img/cloud.png';
import cloud2 from '../img/cloud2.png';
import cloud3 from '../img/cloud3.png';
import cloud4 from '../img/cloud4.png';
import cloud5 from '../img/cloud5.png';
import cloud6 from '../img/cloud6.png';
import cloud7 from '../img/cloud-strokes-six.png';
import cloud8 from '../img/stroke-new.png';
import clouds from '../img/clouds.png';
import test from '../img/myStrokes.png';
import cloud9 from '../img/cloud9.png';
import cloud10 from '../img/clouds10.png';

// import gsap from 'gsap';

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // alpha: true,
      // premultipliedAlpha: false
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    // pastel blue nice 
    // this.renderer.setClearColor(0xA7C7E7, 1);
    // bright blue nice 
    this.renderer.setClearColor(0x0096FF, 1);
    // light blue 
    // this.renderer.setClearColor(0xADD8E6, 1);
    // aqua
    // this.renderer.setClearColor(0x00FFFF, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // not sure if needed here
    // this.container = document.getElementById("container");
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

    this.isPlaying = true;

    this.loader = new THREE.TextureLoader();
    this.textures = [cloud, cloud2, cloud3, cloud4, cloud5, cloud6]

    this.index = 0;
    this.COLOR = new THREE.Color(0xA7C7E7);
    this.COLOR1 = new THREE.Color(0xADD8E6);
    this.COLOR2 = new THREE.Color(0x00FFFF);
    this.COLOR3 = new THREE.Color(0x0096FF);
    this.colorArray = [this.COLOR, this.COLOR1, this.COLOR2, this.COLOR3]

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.point = new THREE.Vector3();

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();
    this.mouseEvent();
    this.changeColor();
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
        // t1: { value: new THREE.TextureLoader().load(brush) },
        t1: { value: this.loader.load(clouds) },
        // t2: { value: new THREE.TextureLoader().load(blog) },
        resolution: { value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment, 
      depthTest: false,
      depthWrite: false,
      blend: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      // blend: THREE.MultiplyBlending,
      // minFilter: THREE.LinearFilter,
      // magFilter: THREE.LinearFilter
    });
    this.geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1);

    this.ig = new THREE.InstancedBufferGeometry();
    console.log(this.ig)
    this.ig.attributes = this.geometry.attributes;
    this.ig.index = this.geometry.index;

    let number = 1000;
    let translateArray = new Float32Array(number*3);
    let rotateArray = new Float32Array(number);

    let radius = 0.7;

    for (let i = 0; i < number; i++) {
      let theta = Math.random()*2*Math.PI
      translateArray.set([
      radius*Math.sin(theta),
      radius*Math.cos(theta),
      -Math.random()*5
      ],3*i)
      rotateArray.set([
        Math.random()*2*Math.PI,
      ], i)
    }

    this.ig.setAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3))
    this.ig.setAttribute('aRotate', new THREE.InstancedBufferAttribute(rotateArray, 1))

    this.plane = new THREE.Mesh(this.ig, this.material);
    this.scene.add(this.plane);
  }

  mouseEvent() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      
      const intersects = this.raycaster.intersectObjects([this.plane]);
      console.log(intersects, "hello");

      this.scene.background = this.colorArray[this.index];

      // this.index = this.index >= this.colorArray.length - 1 ? 0 : this.index + 1
      
      console.log(this.index, 'index')
      
        
      if(intersects[0]) {
        this.index = this.index >= this.colorArray.length - 1 ? 0 : this.index + 1 
      }

      // for ( let i = 0; i < intersects.length; i ++ ) {
		  //   intersects[ i ].object.material.color.set( 0xff0000 );
	    // }
    });
  }

  // raycasterEvent() {
  //   window.addEventListener('pointermove', (event) => {

  //     this.pointer.x = ( event.clientX / this.width ) * 2 - 1;
  //     this.pointer.y = - ( event.clientY / this.height ) * 2 + 1;

  //     this.raycaster.setFromCamera(this.pointer, this.camera);
  //     const intersects = this.raycaster.intersectObjects([this.plane]);

  //     if(intersects[0]) {
  //       this.point.copy(intersects[0].point)
  //     }
      
  //   });
  // }

  changeColor() {
    document.getElementById('container').addEventListener('click', () => {
      // this.scene.background = new THREE.Color(0xA7C7E7)
      this.scene.background = this.colorArray[this.index];

      this.index = this.index >= this.colorArray.length - 1 ? 0 : this.index + 1 

      console.log(this.index, 'index')
      
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
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.progress.value = this.settings.progress;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById('container')
});