import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class RessourceLoader {
  declare GLTFLoader: GLTFLoader;
  constructor() {
    this.GLTFLoader = new GLTFLoader();
    //@ts-ignore
    window.ressourceLoader = this;
  }

  loadObject(path: string, onLoad: any) {
    this.GLTFLoader.load(path, onLoad);
  }
}
