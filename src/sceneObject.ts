import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

interface meshTransform {
  x: number;
  y: number;
  z: number;
}

export default class SceneObject extends THREE.Mesh {
  declare endPosition: meshTransform;
  declare endRotation: meshTransform;
  declare endScale: meshTransform;
  declare startPosition: meshTransform;
  declare startRotation: meshTransform;
  declare startScale: meshTransform;
  declare friction: number;

  constructor(
    position: meshTransform,
    rotation: meshTransform,
    scale: meshTransform,
    geometry: THREE.BufferGeometry,
    friction: number,
    material: THREE.MeshPhysicalMaterial
  ) {
    super(geometry, material);

    //@ts-ignore
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.rotation.x = rotation.x;
    this.rotation.y = rotation.y;
    this.rotation.z = rotation.z;
    this.scale.x = scale.x;
    this.scale.y = scale.y;
    this.scale.z = scale.z;

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

    this.castShadow = true;
    this.receiveShadow = true;
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

  animate = (alpha: number) => {
    this.position.x = lerp(this.startPosition.x, this.endPosition.x, alpha);
    this.position.y = lerp(this.startPosition.y, this.endPosition.y, alpha);
    this.position.z = lerp(this.startPosition.z, this.endPosition.z, alpha);

    this.rotation.x = lerp(this.startRotation.x, this.endRotation.x, alpha);
    this.rotation.y = lerp(this.startRotation.y, this.endRotation.y, alpha);
    this.rotation.z = lerp(this.startRotation.z, this.endRotation.z, alpha);

    this.scale.x = lerp(this.startScale.x, this.endScale.x, alpha);
    this.scale.y = lerp(this.startScale.y, this.endScale.y, alpha);
    this.scale.z = lerp(this.startScale.z, this.endScale.z, alpha);
  };

  destroy() {
    this.geometry.dispose();
  }
}
