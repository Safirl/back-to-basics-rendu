import BaseExperience from "./BaseExperience";
import SceneObject from "./object";
import * as THREE from "three"
import vertex from "./shaders/vertex.glsl"
import frag from "./shaders/fragment.glsl"

export default class Experience extends BaseExperience {
    declare objects: SceneObject[]
    declare material: THREE.MeshPhysicalMaterial
    declare uniforms: any

    constructor() {
        super()
    }

    createScene(): void {
        super.createScene()

        // this.material = new THREE.ShaderMaterial({
        //     vertexShader: vertex,
        //     fragmentShader: frag,
        //     uniforms: {
        //         alpha: { value: this.data.animAlpha },
        //         fishEyeDelta: { value: this.data.fishEyeDelta },
        //         distanceFactor: { value: this.data.distanceFactor },
        //         sceneDistance: { value: this.data.sceneDistance },
        //         zoomFactor: { value: this.data.zoomFactor },
        //         positionRef: { value: { x: 0, y: 2.5, z: 0 } },
        //     }
        // })

        this.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.5
        })

        this.uniforms = {
            animAlpha: { value: this.data.animAlpha },
            fishEyeDelta: { value: this.data.fishEyeDelta },
            distanceFactor: { value: this.data.distanceFactor },
            sceneDistance: { value: this.data.sceneDistance },
            zoomFactor: { value: this.data.zoomFactor },
            positionRef: { value: { x: 0, y: 2.5, z: 0 } },
        }

        this.material.onBeforeCompile = (shader) => {
            // STEP 1: Add uniforms
            Object.keys(this.uniforms).forEach(key => {
                console.log(key)
                //@ts-ignore
                shader.uniforms[key] = this.uniforms[key];
                // console.log(shader.uniforms)
            });

            // ======================================
            // VERTEX SHADER
            // ======================================
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                `
                    // === CUSTOM VERTEX DECLARATIONS ===

                    uniform float animAlpha;
                    uniform float fishEyeDelta;
                    uniform float distanceFactor;
                    uniform float sceneDistance;
                    uniform float zoomFactor;
                    uniform vec3 positionRef;

                    varying vec2 dxy;

                    float exponentialOut(float t) {
                        return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
                    }

                    void main() {`
            )

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                #include <begin_vertex>
                 // Start with original position

                //Get la world position
                vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
                vec3 center = positionRef;

                float dx = worldPos.x - center.x;
                float dy = worldPos.y - center.y;
                float distance = sqrt(dx*dx + dy*dy);
                // distance = sqrt(  distance * distance ) ;
                float angle = atan(dy, dx);
                float factor = fishEyeDelta  + exponentialOut( distanceFactor * distance / sceneDistance ) * zoomFactor;
                float xAlignement = cos(angle) * factor;// * exponentialOut( dy / 10. );
                float yAlignement = sin(angle) * factor;// * ( abs( dy / dx ) );

                dxy.x = dx;
                dxy.y = dy;
                transformed = vec3(transformed.x + xAlignement * animAlpha, transformed.y + yAlignement * animAlpha, transformed.z);
                `
            )
        }

        this.objects = []

        //Create objects
        const cabinetGeometry = new THREE.BoxGeometry(5, 3, 3);
        const cabinet = new SceneObject({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, cabinetGeometry, .1, this.material)
        cabinet.setEndTransform(
            { x: .1, y: .2, z: 0 },
            { x: 0, y: 0, z: Math.PI / 128 },
            { x: 1, y: 1, z: 1 },
        )
        this.scene.add(cabinet)

        const tvGeometry = new THREE.BoxGeometry(3, 2, 2, 10, 10, 10);
        const tv = new SceneObject({ x: 0, y: 2.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, tvGeometry, .1, this.material)
        tv.setEndTransform(
            { x: 0, y: 3, z: 0 },
            { x: 0, y: 0, z: -Math.PI / 128 },
            { x: 1, y: 1, z: 1 },
        )
        this.scene.add(tv)

        const planeGeometry = new THREE.PlaneGeometry(30, 30);
        const plane = new SceneObject({ x: 0, y: -1.5, z: 0 }, { x: -Math.PI / 2, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, planeGeometry, .1, this.material)
        this.scene.add(plane)

        const wallGeometry = new THREE.PlaneGeometry(30, 30);
        const wall = new SceneObject({ x: 0, y: 0, z: -5 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, wallGeometry, .1, this.material)
        this.scene.add(wall)

        const lightGeometry = new THREE.BoxGeometry(.3, 8, .2, 128, 128);
        const light = new SceneObject({ x: -5, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, lightGeometry, .1, this.material)
        light.setEndTransform(
            { x: -5.5, y: .8, z: 0 },
            { x: 0, y: 0, z: Math.PI / 128 },
            { x: 1, y: 1, z: 1 },
        )
        this.scene.add(light)

        const frameGeometry = new THREE.PlaneGeometry(2, 2.5, 20, 20);
        const frame = new SceneObject({ x: 5, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, frameGeometry, .1, this.material)
        frame.setEndTransform(
            { x: 5, y: 4, z: 0 },
            { x: Math.PI / 128, y: 0, z: Math.PI / 100 },
            { x: 1, y: 1, z: 1 },
        )
        this.scene.add(frame)

        const potGeometry = new THREE.CylinderGeometry(.3, .25, .5);
        const pot = new SceneObject({ x: 2, y: 1.5 + .25, z: 1.1 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, potGeometry, .1, this.material)
        pot.setEndTransform(
            { x: 2.5, y: 3.5, z: 1.1 },
            { x: 0, y: 0, z: Math.PI / 12 },
            { x: 1, y: 1, z: 1 },
        )
        this.scene.add(pot)

        this.objects.push(cabinet, tv, /*plane, wall,*/ light, frame, pot)
    }

    addGUI(): void {
        this.data = {
            ...this.data,
            animAlpha: 1.,
            fishEyeDelta: 0.,
            distanceFactor: 1.,
            sceneDistance: 10.,
            zoomFactor: 5.,
        }

        super.addGUI()
        this.gui
            .add(this.data, "animAlpha")
            .min(0)
            .max(1)
            .step(0.01)
            .onChange(() => this.rebuildObjectsFromData())

        this.gui
            .add(this.data, "fishEyeDelta")
            .min(0)
            .max(5)
            .step(0.1)
            .onChange(() => this.rebuildObjectsFromData())

        this.gui
            .add(this.data, "distanceFactor")
            .min(0)
            .max(1)
            .step(0.01)
            .onChange(() => this.rebuildObjectsFromData())

        this.gui
            .add(this.data, "sceneDistance")
            .min(0)
            .max(100)
            .step(0.1)
            .onChange(() => this.rebuildObjectsFromData())

        this.gui
            .add(this.data, "zoomFactor")
            .min(-10)
            .max(20)
            .step(0.1)
            .onChange(() => this.rebuildObjectsFromData())
    }

    rebuildObjectsFromData(): void {
        super.rebuildObjectsFromData()
        this.uniforms.animAlpha.value = this.data.animAlpha
        this.uniforms.fishEyeDelta.value = this.data.fishEyeDelta
        this.uniforms.distanceFactor.value = this.data.distanceFactor
        this.uniforms.sceneDistance.value = this.data.sceneDistance
        this.uniforms.zoomFactor.value = this.data.zoomFactor
    }

    tick(time: number): void {
        this.objects.forEach(object => {
            object.animate(this.data.animAlpha);
        });
        super.tick(time)
    }
}