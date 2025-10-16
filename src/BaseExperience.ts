import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { EventEmitter } from "./utils/EventEmitter";
import LightManager from "./LightManager";

export default class BaseExperience {
  declare canvas: HTMLCanvasElement;
  declare scene: THREE.Scene;
  declare sizes;
  declare data;
  declare camera: THREE.PerspectiveCamera;
  declare renderer: THREE.WebGLRenderer;
  declare controls: OrbitControls;
  declare gui: GUI;
  declare pointLight: THREE.PointLight;
  declare ambientLight: THREE.AmbientLight;
  declare lightManager: LightManager

  constructor() {
  }

  createScene() {
    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

    if (!this.canvas) {
      console.error("no canvas found with class webgl");
      return;
    }

    //data ---------------------

    this.data = {
      ambientLightIntensity: .2,
      enableOrbit: false
    };

    //Set sizes (override for custom size)
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //End --------------------------

    //Handle events
    window.addEventListener("resize", () => {
      //update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      //Refresh camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      //Refresh renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    //Init scene, renderer and handle resize
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      100,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 6);

    //@ts-ignore
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Create orbit controls
    if (this.data.enableOrbit) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
    }

    //Create ambient light
    this.ambientLight = new THREE.AmbientLight(
      "#ffc25b",
      this.data.ambientLightIntensity
    );
    this.scene.add(this.ambientLight);

    //Create a point light
    // this.pointLight = new THREE.PointLight(
    //   "#ffc25b",
    //   this.data.pointLightIntensity
    // );
    // // x: -5, y: -1.5, z: 0
    // this.pointLight.position.y = 5;
    // this.pointLight.position.x = -5;
    // this.pointLight.position.z = 0;
    // this.pointLight.castShadow = true;
    // this.scene.add(this.pointLight);

    this.lightManager = new LightManager(this.scene);

    //Animate Scene on frame

    this.renderer.setAnimationLoop((time) => {
      this.tick(time);
    });

    this.addGUI();
  }

  addGUI() {
    //GUI -----------------------------------

    //Rebuild light from GUI parameters

    this.gui = new GUI();

    this.gui
      .add(this.data, "ambientLightIntensity")
      .min(0)
      .max(20)
      .step(0.1)
      .onChange(() => this.rebuildObjectsFromData());

    this.gui
      .add(this.data, "enableOrbit")
      .onChange(() => this.rebuildObjectsFromData());

    // this.refreshGUI()
  }

  rebuildObjectsFromData() {
    // this.pointLight.intensity = this.data.pointLightIntensity;
    this.ambientLight.intensity = this.data.ambientLightIntensity;
    if (this.data.enableOrbit) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
    }
    else {
      this.controls = null
    }
    // this.eventEmitter.emit("onGUIRebuild")
  }

  tick(time: number) {
    if (this.data.enableOrbit) {
      this.controls.update();
    }
    this.renderer.render(this.scene, this.camera);
  }
}
