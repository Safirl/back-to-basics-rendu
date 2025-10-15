import BaseExperience from "./BaseExperience";
import SceneObject from "./object";
import * as THREE from "three";
import vertex from "./shaders/vertex.glsl";
import frag from "./shaders/fragment.glsl";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { declaration, implementation } from "./shaders/fishEyeShader";
import RessourceLoader from "./utils/ressourceLoader";
import GLTFObject from "./gltfObject";

export default class Experience extends BaseExperience {
  declare objects: SceneObject[];
  declare GLTFObjects: GLTFObject[];
  declare material: THREE.MeshPhysicalMaterial;
  declare uniforms: any;
  declare ressourceLoader: RessourceLoader;

  constructor() {
    super();
    this.ressourceLoader = new RessourceLoader();
  }

  createScene(): void {
    super.createScene();

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.5,
    });

    this.uniforms = {
      animAlpha: { value: this.data.animAlpha },
      fishEyeDelta: { value: this.data.fishEyeDelta },
      distanceFactor: { value: this.data.distanceFactor },
      sceneDistance: { value: this.data.sceneDistance },
      zoomFactor: { value: this.data.zoomFactor },
      positionRef: { value: { x: 0.1, y: 1.7, z: 0 } },
    };

    this.material.onBeforeCompile = (shader) => {
      // STEP 1: Add uniforms
      const uniformsCopy = {
        ...this.uniforms,
        deformationFactor: { value: 1 },
      };
      Object.keys(uniformsCopy).forEach((key) => {
        //@ts-ignore
        shader.uniforms[key] = uniformsCopy[key];
      });

      // ======================================
      // VERTEX SHADER
      // ======================================
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        declaration
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        implementation
      );
    };

    this.objects = [];
    this.GLTFObjects = [];

    //Create objects

    const tv = new GLTFObject(
      { x: 0, y: 1.7, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 1.5, y: 1.5, z: 1.5 },
      "./models/tv.glb",
      0.1,
      this.uniforms,
      () => {
        tv.setEndTransform(
          { x: -0.2, y: 2.5, z: 0 },
          { x: 0, y: 0, z: -Math.PI / 128 }, //-Math.PI / 128
          { x: 1.5, y: 1.5, z: 1.5 }
        );
        this.scene.add(tv.root);
      }
    );

    const cabinet = new GLTFObject(
      { x: 0, y: -0.2, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      "./models/cabinet.glb",
      0.1,
      this.uniforms,
      () => {
        cabinet.setEndTransform(
          { x: 0.1, y: 0.2, z: 0 },
          { x: 0, y: 0, z: Math.PI / 128 },
          { x: 1, y: 1, z: 1 }
        );
        this.scene.add(cabinet.root);
      }
    );

    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const plane = new SceneObject(
      { x: 0, y: -1.5, z: 0 },
      { x: -Math.PI / 2, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      planeGeometry,
      0.1,
      this.material
    );
    this.scene.add(plane);

    const wallGeometry = new THREE.PlaneGeometry(30, 30);
    const wall = new SceneObject(
      { x: 0, y: 0, z: -5 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      wallGeometry,
      0.1,
      this.material
    );
    this.scene.add(wall);

    // const lightGeometry = new THREE.BoxGeometry(0.3, 8, 0.2, 128, 128);
    // const light = new SceneObject(
    //   { x: -5, y: 0, z: 0 },
    //   { x: 0, y: 0, z: 0 },
    //   { x: 1, y: 1, z: 1 },
    //   lightGeometry,
    //   0.1,
    //   this.material
    // );
    // light.setEndTransform(
    //   { x: -5.5, y: 0.8, z: 0 },
    //   { x: 0, y: 0, z: Math.PI / 128 },
    //   { x: 1, y: 1, z: 1 }
    // );
    // this.scene.add(light);

    const lamp = new GLTFObject(
      { x: -5, y: -1.5, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0.7, y: 0.7, z: 0.7 },
      "./models/lamp.glb",
      0.1,
      this.uniforms,
      () => {
        lamp.setEndTransform(
          { x: -5.5, y: -1, z: 0 },
          { x: 0, y: 0, z: Math.PI / 128 },
          { x: 1, y: 1, z: 1 }
        );
        this.scene.add(lamp.root);
      },
      100
    );

    // const frameGeometry = new THREE.PlaneGeometry(2, 2.5, 20, 20);
    // const frame = new SceneObject(
    //   { x: 5, y: 4, z: 0 },
    //   { x: 0, y: 0, z: 0 },
    //   { x: 1, y: 1, z: 1 },
    //   frameGeometry,
    //   0.1,
    //   this.material
    // );
    // frame.setEndTransform(
    //   { x: 5, y: 4, z: 0 },
    //   { x: Math.PI / 128, y: 0, z: Math.PI / 100 },
    //   { x: 1, y: 1, z: 1 }
    // );
    // this.scene.add(frame);

    const frame = new GLTFObject(
      { x: 5, y: 4, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0.1, y: 0.1, z: 0.1 },
      "./models/frame.glb",
      0.1,
      this.uniforms,
      () => {
        frame.setEndTransform(
          { x: 5, y: 4, z: 0 },
          { x: Math.PI / 128, y: 0, z: Math.PI / 100 },
          { x: 0.1, y: 0.1, z: 0.1 }
        );
        this.scene.add(frame.root);
      }
    );

    // const potGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.5);
    // const pot = new SceneObject(
    //   { x: 2, y: 1.5 + 0.25, z: 1.1 },
    //   { x: 0, y: 0, z: 0 },
    //   { x: 1, y: 1, z: 1 },
    //   potGeometry,
    //   0.1,
    //   this.material
    // );
    // pot.setEndTransform(
    //   { x: 2.5, y: 3.5, z: 1.1 },
    //   { x: 0, y: 0, z: Math.PI / 12 },
    //   { x: 1, y: 1, z: 1 }
    // );
    // this.scene.add(pot);

    const pot = new GLTFObject(
      { x: 2, y: 1, z: 0.8 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      "./models/pot.glb",
      0.1,
      this.uniforms,
      () => {
        pot.setEndTransform(
          { x: 2, y: 3, z: 0.8 },
          { x: 0, y: 0, z: Math.PI / 128 },
          { x: 1, y: 1, z: 1 }
        );
        this.scene.add(pot.root);
      }
    );

    this.objects.push(/*plane, wall,*/);
    this.GLTFObjects.push(tv, cabinet, pot, frame);
  }

  addGUI(): void {
    this.data = {
      ...this.data,
      animAlpha: 0,
      fishEyeDelta: 0,
      distanceFactor: 1,
      sceneDistance: 10,
      zoomFactor: 1.6,
    };

    super.addGUI();
    this.gui
      .add(this.data, "animAlpha")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => this.rebuildObjectsFromData());

    this.gui
      .add(this.data, "fishEyeDelta")
      .min(0)
      .max(5)
      .step(0.1)
      .onChange(() => this.rebuildObjectsFromData());

    this.gui
      .add(this.data, "distanceFactor")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => this.rebuildObjectsFromData());

    this.gui
      .add(this.data, "sceneDistance")
      .min(0)
      .max(100)
      .step(0.1)
      .onChange(() => this.rebuildObjectsFromData());

    this.gui
      .add(this.data, "zoomFactor")
      .min(-10)
      .max(20)
      .step(0.1)
      .onChange(() => this.rebuildObjectsFromData());
  }

  rebuildObjectsFromData(): void {
    super.rebuildObjectsFromData();
    this.uniforms.animAlpha.value = this.data.animAlpha;
    this.uniforms.fishEyeDelta.value = this.data.fishEyeDelta;
    this.uniforms.distanceFactor.value = this.data.distanceFactor;
    this.uniforms.sceneDistance.value = this.data.sceneDistance;
    this.uniforms.zoomFactor.value = this.data.zoomFactor;
  }

  tick(time: number): void {
    this.objects.forEach((object) => {
      object.animate(this.data.animAlpha);
    });
    this.GLTFObjects.forEach((object) => {
      object.animate(this.data.animAlpha);
    });
    super.tick(time);
  }
}
