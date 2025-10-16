import { EventEmitter } from "./utils/EventEmitter";
import Experience from "./Experience"
import Dialogue from "./component/dialogue";
import { dialogues } from "./data/dialogues";
import gsap from "gsap";

export default class SequenceManager {
    declare eventEmitter: EventEmitter
    declare experience: Experience
    declare currentIntroDialogue: number
    declare blackScreen: HTMLDivElement
    declare boundIntro: () => void
    declare boundChangeChanel: () => void
    declare boundCursedScene: () => void
    declare boundRemovePlayDialogue: () => void
    declare currentAlphaAnim

    constructor() {
        this.currentAlphaAnim = null
        this.currentIntroDialogue = -1;
        this.eventEmitter = new EventEmitter();
        window.eventEmitter = this.eventEmitter;
        this.experience = new Experience()

        // Stocker les fonctions liées
        this.boundIntro = this.intro.bind(this);
        this.boundCursedScene = this.setCursedScene.bind(this);
        this.boundChangeChanel = this.changeChannel.bind(this);
        this.boundRemovePlayDialogue = this.removePlayDialogue.bind(this);

        //Bind
        this.eventEmitter.on("onEyePlayed", this.boundCursedScene)
    }

    startExperience() {
        this.blackScreen = document.createElement("div")
        this.blackScreen.className = "blackScreen"
        document.body.append(this.blackScreen)
        this.experience.createScene()
        document.addEventListener("click", this.boundIntro)
    }

    intro() {
        if (this.currentIntroDialogue > -1) {
            const oldDialogue = document.getElementById("dialogue")
            oldDialogue?.remove()
        }
        this.currentIntroDialogue++
        if (this.currentIntroDialogue > dialogues.intro.length - 1) {
            const oldDialogue = document.getElementById("dialogue")
            oldDialogue?.remove()
            this.showScene()
        }
        else {
            const currentDialogue = dialogues.intro[this.currentIntroDialogue];
            const dialogueModal = new Dialogue(currentDialogue, window.innerWidth / 2, window.innerHeight / 2)
            document.body.append(dialogueModal.container)
        }
    }

    showScene() {
        document.removeEventListener("click", this.boundIntro)
        gsap.to(this.blackScreen, {
            opacity: 0,
            ease: "power2.inOut",
            duration: 2,
            onComplete: () => {
                const dialogueModal = new Dialogue(dialogues.scene[0], window.innerWidth / 2, 150)
                document.body.append(dialogueModal.container)
                document.addEventListener("click", this.boundChangeChanel)
                document.addEventListener("click", this.boundRemovePlayDialogue)
            }
        })
    }

    removePlayDialogue() {
        const oldDialogue = document.getElementById("dialogue")
        oldDialogue?.remove()
        document.removeEventListener("click", this.boundRemovePlayDialogue)
    }

    changeChannel() {
        let data = this.experience.data
        if (this.currentAlphaAnim != null) {
            this.currentAlphaAnim.kill()
        }
        if (this.experience.data.animAlpha > 0) {
            this.currentAlphaAnim = gsap.to(data, {
                animAlpha: 0,
                ease: "sine.inOut",
                duration: .05,
                onUpdate: () => { this.experience.rebuildObjectsFromData() },
                onComplete: () => { this.currentAlphaAnim = null }
            })
        }
        this.eventEmitter.emit("onChangeChannel")
    }

    setCursedScene() {
        const data = this.experience.data
        if (this.currentAlphaAnim != null) {
            this.currentAlphaAnim.kill()
        }
        this.currentAlphaAnim = gsap.to(data, {
            animAlpha: 1,
            ease: "sine.out",
            duration: 8,
            onUpdate: () => {
                this.experience.rebuildObjectsFromData()
                if (data.animAlpha > .95) {
                    this.currentAlphaAnim.kill()
                    this.currentAlphaAnim = null
                    this.setEndScene()
                }
            },
            onComplete: () => { this.currentAlphaAnim = null }
        })
    }

    setEndScene() {
        document.removeEventListener("click", this.boundChangeChanel)
        this.eventEmitter.emit("onEndScene")
    }
}