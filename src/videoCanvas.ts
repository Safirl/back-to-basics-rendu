import * as THREE from "three";
import { videoData } from "./data/videoData";
import { declaration, implementation } from "./shaders/fishEyeShader";
import { EventEmitter } from "./utils/EventEmitter";

export default class VideoCanvas {
  declare ctx: CanvasRenderingContext2D;
  declare video: HTMLVideoElement;
  declare texture: THREE.CanvasTexture;
  declare currentId: number;
  declare material;
  declare boundChangeChannel: () => void;
  declare boundEndScene: () => void;

  constructor(uniforms: any) {
    this.currentId = -1;
    //@ts-ignore
    this.ctx = document.getElementById("video")?.getContext("2d");
    if (!this.ctx) {
      console.error("no canvas found for the video");
      return;
    }

    this.video = document.createElement("video");
    this.video.volume = 1;
    this.ctx.canvas.width = 256;
    this.ctx.canvas.height = 144;
    this.ctx.fillStyle = "#2a200b";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.texture = new THREE.CanvasTexture(this.ctx.canvas);
    // this.texture.magFilter = THREE.NearestFilter;  // Évite le flou
    // this.texture.minFilter = THREE.NearestFilter;
    this.texture.wrapS = THREE.RepeatWrapping; // Important !
    this.texture.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
    });

    this.material.onBeforeCompile = (shader) => {
      // STEP 1: Add uniforms
      const uniformsCopy = {
        ...uniforms,
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
    //Bind on channel changed
    this.boundChangeChannel = this.changeVideo.bind(this);
    this.boundEndScene = this.endScene.bind(this);

    //@ts-ignore
    const emitter: EventEmitter = window.eventEmitter;
    emitter.on("onChangeChannel", this.boundChangeChannel);
  }

  animate() {
    this.ctx.save();
    this.ctx.scale(-1, -1); // Retourner verticalement
    this.ctx.drawImage(
      this.video,
      -this.ctx.canvas.width,
      -this.ctx.canvas.height, // Décaler vers le bas
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    this.ctx.restore();
    this.texture.needsUpdate = true;
  }

  changeVideo() {
    this.currentId++;
    if (this.currentId > videoData.length - 1) {
      this.currentId = 0;
    }
    this.video.src = videoData[this.currentId];
    if (this.video.src.includes("eye")) {
      //@ts-ignore
      const eventEmitter: EventEmitter = window.eventEmitter;
      eventEmitter.emit("onEyePlayed");
    }
    this.video.play();
  }

  endScene() {}
}
