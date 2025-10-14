import * as THREE from "three";
import gsap from "gsap";

interface meshTransform {
  x: number;
  y: number;
  z: number;
}

export default class Object extends THREE.Mesh {
  declare currentAnimation: GSAPAnimation;

  constructor(
    position: meshTransform,
    rotation: meshTransform,
    scale: meshTransform,
    geometry: THREE.BufferGeometry,
    material = new THREE.MeshBasicMaterial()
  ) {
    super(geometry, material);
    //@ts-ignore
    this.currentAnimation = null;
  }

  animate = (
    property: string,
    newValue: any,
    duration: number,
    ease: string,
    onComplete: void
  ) => {
    if (this.currentAnimation != null) {
    }
    gsap.to(this, {
      property,
      duration,
      ease,
      onComplete: () => {
        //@ts-ignore
        this.currentAnimation = null;
        onComplete;
      },
    });
  };

  destroy() {
    this.geometry.dispose();
  }
}
