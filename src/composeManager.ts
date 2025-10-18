import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import * as THREE from "three"

export default class ComposerManager {
    declare renderer: THREE.WebGLRenderer
    declare scene: any
    declare camera: THREE.PerspectiveCamera
    declare composer: EffectComposer
    declare glitchPass: GlitchPass
    declare rgbShift: ShaderPass
    declare data: any

    constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: any) {
        //@ts-ignore
        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.composer = new EffectComposer(renderer);
        this.composer.addPass(new RenderPass(scene, camera));
        // this.glitchPass = new GlitchPass();
        // this.composer.addPass(this.glitchPass);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), .4, 0.4, 0.85);
        // bloomPass.threshold = params.threshold;
        // bloomPass.strength = params.strength;
        // bloomPass.radius = params.radius;
        this.composer.addPass(bloomPass);

        this.rgbShift = new ShaderPass(RGBShiftShader);
        this.rgbShift.uniforms["amount"].value = 0.0015;
        this.composer.addPass(this.rgbShift);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    tick() {
        this.composer.render();
    }

    animate(alpha: number) {
        this.rgbShift.uniforms["amount"].value = Math.max(alpha * 0.015, .0015);
    }

    endScene() {

    }

    addGUI() {

    }
}
