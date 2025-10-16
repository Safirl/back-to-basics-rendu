import { pointLights } from "./data/lightData";
import * as THREE from "three"

export default class LightManager {
    declare scene: THREE.Scene
    constructor(scene: THREE.Scene) {
        this.scene = scene
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
        });
    }
    animate(alpha: number) {

    }
}