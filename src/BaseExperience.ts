import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

export default class BaseExperience {
  declare canvas: HTMLCanvasElement;
  declare scene: THREE.Scene;
  declare sizes;
  declare data;
  declare camera: THREE.PerspectiveCamera;
  declare renderer: THREE.WebGLRenderer;
  declare controls: OrbitControls;
  declare gui: GUI;

  constructor() {}

  createScene() {
    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

    if (!this.canvas) {
      console.error("no canvas found with class webgl");
      return;
    }

    //data ---------------------

    this.data = {
      ambientLightIntensity: 0.1,
      pointLightIntensity: 10,
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
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    //@ts-ignore
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Create orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    //Create base sphere
    const sphereGeometry = new THREE.SphereGeometry(2.5);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("white"),
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.scene.add(sphere);

    //Create ambient light
    const ambientLight = new THREE.AmbientLight(
      "white",
      this.data.ambientLightIntensity
    );
    this.scene.add(ambientLight);

    //Create a point light
    const pointLight = new THREE.PointLight(
      "white",
      this.data.pointLightIntensity
    );
    pointLight.position.y = 5;
    pointLight.position.x = 5;
    pointLight.castShadow = true;
    this.scene.add(pointLight);

    //Animate Scene on frame

    this.renderer.setAnimationLoop(this.tick);

    //GUI -----------------------------------

    //Rebuild light from GUI parameters
    const rebuildLight = () => {
      pointLight.intensity = this.data.pointLightIntensity;
      ambientLight.intensity = this.data.ambientLightIntensity;
    };

    const gui = new GUI();

    gui
      .add(this.data, "ambientLightIntensity")
      .min(0)
      .max(10)
      .step(0.1)
      .onChange(rebuildLight);
    gui
      .add(this.data, "pointLightIntensity")
      .min(0)
      .max(20)
      .step(0.1)
      .onChange(rebuildLight);
  }

  tick = (time: number) => {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
