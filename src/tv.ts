import * as THREE from "three";
import GLTFObject from "./gltfObject";
import VideoCanvas from "./videoCanvas";

interface meshTransform {
    x: number;
    y: number;
    z: number;
}

export default class Tv extends GLTFObject {
    declare tvScreen: VideoCanvas
    declare uniforms
    constructor(position: meshTransform,
        rotation: meshTransform,
        scale: meshTransform,
        GLTFPath: string,
        friction: number,
        uniforms: any,
        onLoaded: () => void,
        deformationFactor: number = 1) {
        super(
            position,
            rotation,
            scale,
            GLTFPath,
            friction,
            uniforms,
            onLoaded,
            deformationFactor
        )
        this.uniforms = uniforms
    }

    animate(alpha: number): void {
        super.animate(alpha)
        if (!this.tvScreen) {
            return;
        }
        this.tvScreen.animate();
    }

    onLoaded(onLoaded: () => void): void {
        super.onLoaded(onLoaded)
        this.tvScreen = new VideoCanvas(this.uniforms);

        const screenMesh = this.root.children[47];
        screenMesh.material = this.tvScreen.material;
    }
}
