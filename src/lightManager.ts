import { lerp } from "three/src/math/MathUtils.js";
import { pointLights, ambientLightData } from "./data/lightData";
import * as THREE from "three";
import type { EventEmitter } from "./utils/EventEmitter";

export default class LightManager {
  declare scene: THREE.Scene;
  declare lights: THREE.Light[];
  declare ambientLight: THREE.AmbientLight;

  constructor(scene: THREE.Scene, data) {
    this.scene = scene;
    this.lights = [];
    pointLights.forEach((light) => {
      const pointLight = new THREE.PointLight(light.color, light.intensity);
      // x: -5, y: -1.5, z: 0
      pointLight.position.x = light.position.x;
      pointLight.position.y = light.position.y;
      pointLight.position.z = light.position.z;
      pointLight.castShadow = true;
      this.scene.add(pointLight);
      this.lights.push(pointLight);
    });
    this.ambientLight = new THREE.AmbientLight(
      ambientLightData.color,
      data.ambientLightIntensity
    );
    this.scene.add(this.ambientLight);
  }

  animate(alpha: number) {
    for (let index = 0; index < this.lights.length; index++) {
      const light = this.lights[index];
      const startColor = new THREE.Color(pointLights[index].color);
      const endColor = new THREE.Color(pointLights[index].endColor);
      const r = lerp(startColor.r, endColor.r, alpha);
      const g = lerp(startColor.g, endColor.g, alpha);
      const b = lerp(startColor.b, endColor.b, alpha);
      light.color = new THREE.Color().setRGB(r, g, b);
      light.intensity = lerp(
        pointLights[index].intensity,
        pointLights[index].endIntensity,
        alpha
      );
    }
    const startColor = new THREE.Color(ambientLightData.color);
    const endColor = new THREE.Color(ambientLightData.endColor);
    const r = lerp(startColor.r, endColor.r, alpha);
    const g = lerp(startColor.g, endColor.g, alpha);
    const b = lerp(startColor.b, endColor.b, alpha);
    this.ambientLight.color = new THREE.Color().setRGB(r, g, b);
    this.ambientLight.intensity = lerp(
      ambientLightData.intensity,
      ambientLightData.endIntensity,
      alpha
    );
  }

  endScene() {
    this.lights[0].color = new THREE.Color(pointLights[0].endColor);
    this.lights[0].intensity = 0;
    this.ambientLight.intensity = 0;
    this.switchLightOn();
  }

  switchLightOn() {
    setTimeout(() => {
      const eventEmitter: EventEmitter = window.eventEmitter;
      eventEmitter.emit("onLightToggled");
      this.lights[0].intensity = pointLights[0].intensity;
      this.switchLightOff();
    }, (Math.random() + 1) * 2000);
  }

  switchLightOff() {
    setTimeout(() => {
      this.lights[0].intensity = 0;
      this.switchLightOn();
    }, (Math.random() + 0.2) * 1000);
  }

  rebuildLights(data) {
    this.ambientLight.intensity = data.ambientLightIntensity;
  }
}
