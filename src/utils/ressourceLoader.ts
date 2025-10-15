import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class RessourceLoader {
  declare GLTFLoader: GLTFLoader;
  constructor() {
    this.GLTFLoader = new GLTFLoader();
    window.ressourceLoader = this;
  }

  loadObject(path: string, onLoad) {
    this.GLTFLoader.load(path, onLoad);
  }
}
