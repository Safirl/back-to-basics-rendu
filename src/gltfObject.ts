import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { declaration, implementation } from "./shaders/fishEyeShader";
import RessourceLoader from "./utils/ressourceLoader";

interface meshTransform {
  x: number;
  y: number;
  z: number;
}

export default class GLTFObject {
  declare endPosition: meshTransform;
  declare endRotation: meshTransform;
  declare endScale: meshTransform;
  declare startPosition: meshTransform;
  declare startRotation: meshTransform;
  declare startScale: meshTransform;
  declare friction: number;
  declare root: THREE.Scene;

  constructor(
    position: meshTransform,
    rotation: meshTransform,
    scale: meshTransform,
    GLTFPath: string,
    friction: number,
    uniforms: any,
    onLoaded: () => void,
    deformationFactor: number = 1
  ) {
    this.startPosition = { x: 0, y: 0, z: 0 };
    this.startPosition.x = position.x;
    this.startPosition.y = position.y;
    this.startPosition.z = position.z;

    this.startRotation = { x: 0, y: 0, z: 0 };
    this.startRotation.x = rotation.x;
    this.startRotation.y = rotation.y;
    this.startRotation.z = rotation.z;

    this.startScale = { x: 0, y: 0, z: 0 };
    this.startScale.x = scale.x;
    this.startScale.y = scale.y;
    this.startScale.z = scale.z;

    this.endPosition = this.startPosition;
    this.endRotation = this.startRotation;
    this.endScale = this.startScale;

    this.friction = friction;

    const RL: RessourceLoader = window.ressourceLoader;
    if (!RL) {
      console.error("No ressource loader found");
    }
    RL.loadObject(GLTFPath, (gltf) => {
      this.root = gltf.scene;
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.wireframe = false;
          child.material.onBeforeCompile = (shader) => {
            const uniformsCopy = {
              ...uniforms,
              deformationFactor: { value: deformationFactor },
            };
            Object.keys(uniformsCopy).forEach((key) => {
              //@ts-ignore
              shader.uniforms[key] = uniformsCopy[key];
              // console.log(shader.uniforms)
            });
            // shader.uniforms.deformationFactor = deformationFactor;

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
            // très important !
            // child.material.needsUpdate = true;
          };
        }
      });
      this.onLoaded(onLoaded);
    });
  }

  setEndTransform(
    position: meshTransform,
    rotation: meshTransform,
    scale: meshTransform
  ) {
    this.endPosition = position;
    this.endRotation = rotation;
    this.endScale = scale;
  }

  animate(alpha: number) {
    if (!this.root) return;
    this.root.position.x = lerp(
      this.startPosition.x,
      this.endPosition.x,
      alpha
    );
    this.root.position.y = lerp(
      this.startPosition.y,
      this.endPosition.y,
      alpha
    );
    this.root.position.z = lerp(
      this.startPosition.z,
      this.endPosition.z,
      alpha
    );
    this.root.rotation.x = lerp(
      this.startRotation.x,
      this.endRotation.x,
      alpha
    );
    this.root.rotation.y = lerp(
      this.startRotation.y,
      this.endRotation.y,
      alpha
    );
    this.root.rotation.z = lerp(
      this.startRotation.z,
      this.endRotation.z,
      alpha
    );
    this.root.scale.x = lerp(this.startScale.x, this.endScale.x, alpha);
    this.root.scale.y = lerp(this.startScale.y, this.endScale.y, alpha);
    this.root.scale.z = lerp(this.startScale.z, this.endScale.z, alpha);
  };

  destroy() {
    // this.geometry.dispose();
  }

  onLoaded(onLoaded: () => void) {
    onLoaded()
  }
}
