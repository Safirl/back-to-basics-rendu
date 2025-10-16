import { lerp } from "three/src/math/MathUtils.js";
import { pointLights } from "./data/lightData";
import * as THREE from "three"

export default class LightManager {
    declare scene: THREE.Scene
    declare lights: THREE.Light[]
    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.lights = []
        pointLights.forEach(light => {
            const pointLight = new THREE.PointLight(
                light.color,
                light.intensity
            );
            // x: -5, y: -1.5, z: 0
            pointLight.position.x = light.position.x;
            pointLight.position.y = light.position.y;
            pointLight.position.z = light.position.z;
            pointLight.castShadow = true;
            this.scene.add(pointLight);
            this.lights.push(pointLight)
        });
    }

    animate(alpha: number) {
        for (let index = 0; index < this.lights.length; index++) {
            const light = this.lights[index];
            const startColor = new THREE.Color(pointLights[index].color)
            const endColor = new THREE.Color(pointLights[index].endColor)
            const r = lerp(startColor.r, endColor.r, alpha)
            const g = lerp(startColor.g, endColor.g, alpha)
            const b = lerp(startColor.b, endColor.b, alpha)
            light.color = new THREE.Color().setRGB(r, g, b)
            light.intensity = lerp(pointLights[index].intensity, pointLights[index].endIntensity, alpha)
        }
    }
}