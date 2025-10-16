import BaseExperience from "./BaseExperience";
import SceneObject from "./sceneObject";
import * as THREE from "three";
import { declaration, implementation } from "./shaders/fishEyeShader";
import RessourceLoader from "./utils/ressourceLoader";
import GLTFObject from "./gltfObject";
import VideoCanvas from "./videoCanvas";
import Tv from "./tv";

export default class Experience extends BaseExperience {
  declare objects: SceneObject[];
  declare GLTFObjects: GLTFObject[];
  declare uniforms: any;
  declare ressourceLoader: RessourceLoader;
  declare tvScreen: VideoCanvas;

  constructor() {
    super();
    this.ressourceLoader = new RessourceLoader();
  }

  createScene(): void {
    super.createScene();

    const textureLoader = new THREE.TextureLoader();
    const wallNormal = textureLoader.load("./textures/wall_nor.jpg");
    const wallArm = textureLoader.load("./textures/wall_arm.jpg");
    const wallMap = textureLoader.load("./textures/wall_diff.jpg");
    wallArm.wrapS = THREE.RepeatWrapping;
    wallArm.wrapT = THREE.RepeatWrapping;
    wallMap.wrapS = THREE.RepeatWrapping;
    wallMap.wrapT = THREE.RepeatWrapping;
    wallNormal.wrapS = THREE.RepeatWrapping;
    wallNormal.wrapT = THREE.RepeatWrapping;

    wallArm.repeat.set(4, 4);
    wallMap.repeat.set(4, 4);
    wallNormal.repeat.set(4, 4);

    const wallMaterial = new THREE.MeshPhysicalMaterial({
      map: wallMap,
      normalMap: wallNormal,
      aoMap: wallArm,
      metalnessMap: wallArm,
      roughnessMap: wallArm,
    });

    const floorNormal = textureLoader.load("./textures/floor_nor.jpg");
    const floorArm = textureLoader.load("./textures/floor_arm.jpg");
    const floorMap = textureLoader.load("./textures/floor_diff.jpg");
    floorArm.wrapS = THREE.RepeatWrapping;
    floorArm.wrapT = THREE.RepeatWrapping;
    floorMap.wrapS = THREE.RepeatWrapping;
    floorMap.wrapT = THREE.RepeatWrapping;
    floorNormal.wrapS = THREE.RepeatWrapping;
    floorNormal.wrapT = THREE.RepeatWrapping;

    floorArm.repeat.set(10, 10);
    floorMap.repeat.set(10, 10);
    floorNormal.repeat.set(10, 10);

    const floorMaterial = new THREE.MeshPhysicalMaterial({
      map: floorMap,
      normalMap: floorNormal,
      aoMap: floorArm,
      metalnessMap: floorArm,
      roughnessMap: floorArm,
    });

    this.uniforms = {
      animAlpha: { value: this.data.animAlpha },
      fishEyeDelta: { value: this.data.fishEyeDelta },
      distanceFactor: { value: this.data.distanceFactor },
      sceneDistance: { value: this.data.sceneDistance },
      zoomFactor: { value: this.data.zoomFactor },
      positionRef: { value: { x: 0.1, y: 1.7, z: 0 } },
    };

    wallMaterial.onBeforeCompile = (shader) => {
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

    const tv = new Tv(
      { x: -0.22, y: 1.5, z: 0.7 },
      { x: 0, y: Math.PI, z: 0 },
      { x: 1.2, y: 1.2, z: 1.2 },
      "./models/tv.glb",
      0.1,
      this.uniforms,
      () => {
        tv.setEndTransform(
          { x: -0.2, y: 2.5, z: 0.7 },
          { x: 0, y: Math.PI, z: -Math.PI / 128 }, //-Math.PI / 128
          { x: 1.2, y: 1.2, z: 1.2 }
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

    const planeGeometry = new THREE.PlaneGeometry(60, 60, 10, 10);
    const plane = new SceneObject(
      { x: 0, y: -1.5, z: 0 },
      { x: -Math.PI / 2, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      planeGeometry,
      0.1,
      floorMaterial
    );
    this.scene.add(plane);

    const wallGeometry = new THREE.PlaneGeometry(60, 60, 10, 10);
    const wall = new SceneObject(
      { x: 0, y: 0, z: -3 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      wallGeometry,
      0.1,
      wallMaterial
    );
    this.scene.add(wall);

    const lamp = new GLTFObject(
      { x: -5, y: -1.5, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0.7, y: 0.7, z: 0.7 },
      "./models/lamp.glb",
      0.1,
      this.uniforms,
      () => {
        lamp.setEndTransform(
          { x: -5.5, y: 1, z: 0 },
          { x: 0, y: 0, z: Math.PI / 128 },
          { x: 1, y: 1, z: 1 }
        );
        this.scene.add(lamp.root);
      },
      100
    );

    const frame = new GLTFObject(
      { x: 5, y: 4, z: 0 },
      { x: 0, y: Math.PI, z: 0 },
      { x: 0.3, y: 0.3, z: 0.3 },
      "./models/frame.glb",
      0.1,
      this.uniforms,
      () => {
        frame.setEndTransform(
          { x: 5, y: 4, z: 0 },
          { x: Math.PI / 128, y: Math.PI, z: Math.PI / 100 },
          { x: 0.3, y: 0.3, z: 0.3 }
        );
        this.scene.add(frame.root);
      }
    );

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

    this.objects.push(plane, wall);
    this.GLTFObjects.push(tv, cabinet, pot, frame, lamp);
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

    this.gui.hide();
  }

  rebuildObjectsFromData(): void {
    super.rebuildObjectsFromData();
    this.uniforms.animAlpha.value = this.data.animAlpha;
    this.uniforms.fishEyeDelta.value = this.data.fishEyeDelta;
    this.uniforms.distanceFactor.value = this.data.distanceFactor;
    this.uniforms.sceneDistance.value = this.data.sceneDistance;
    this.uniforms.zoomFactor.value = this.data.zoomFactor;
    this.lightManager.rebuildLights(this.data);
  }

  tick(time: number): void {
    if (this.data.animAlpha <= 1) {
      this.objects.forEach((object) => {
        object.animate(this.data.animAlpha);
      });
      this.GLTFObjects.forEach((object) => {
        object.animate(this.data.animAlpha);
      });
      this.lightManager.animate(this.data.animAlpha);
    }
    super.tick(time);
  }

  endScene() {
    // this.data.ambientLightIntensity = 0;
    this.rebuildObjectsFromData();
    this.data.animAlpha = 2;
    this.lightManager.endScene();
  }
}
