import * as THREE from "three";
import type { EventEmitter } from "./utils/EventEmitter";
import gsap from "gsap";

export default class SoundManager {
  declare currentAudio: THREE.Audio;
  declare currentSFX: THREE.Audio;
  declare currentMusic: THREE.Audio;
  declare listener: THREE.AudioListener;
  declare audioLoader: THREE.AudioLoader;
  constructor() {
    this.listener = new THREE.AudioListener();
    this.currentAudio = new THREE.Audio(this.listener);
    this.currentSFX = new THREE.Audio(this.listener);
    this.currentMusic = new THREE.Audio(this.listener);
    this.audioLoader = new THREE.AudioLoader();
    //@ts-ignore
    const emitter: EventEmitter = window.eventEmitter;
    emitter.on("introStarted", () => {
      this.playIntro();
    });
    emitter.on("sceneLoaded", () => {
      this.sceneLoaded();
    });
    emitter.on("onChangeChannel", () => {
      this.playTVSwitch();
    });
    emitter.on("onCursedScene", () => {
      this.playCursedScene();
    });
    emitter.on("onEndScene", () => {
      this.playEndScene();
    });
    emitter.on("onLightToggled", () => {
      this.playLightFX();
    });
    this.audioLoader.load("./sound/nightmare.mp3", (buffer) => {
      this.currentMusic.setBuffer(buffer);
    });
  }

  playIntro() {
    this.audioLoader.load("./sound/car.mp3", (buffer) => {
      this.currentAudio.setBuffer(buffer);
      this.currentAudio.setLoop(false);
      this.currentAudio.setVolume(0.8);
      this.currentAudio.play();
    });
  }

  sceneLoaded() {
    if (this.currentAudio.isPlaying) {
      const volume = { value: this.currentAudio.getVolume() };
      gsap.to(volume, {
        value: 0,
        onUpdate: () => {
          this.currentAudio.setVolume(volume.value);
        },
        ease: "power2.inOut",
        duration: 2,
        onComplete: () => {
          this.currentAudio.stop();
          this.playTvNoise();
        },
      });
    } else {
      this.playTvNoise();
    }
  }

  playTvNoise() {
    this.audioLoader.load("./sound/tvNoise.mp3", (buffer) => {
      this.currentAudio.setBuffer(buffer);
      this.currentAudio.setLoop(true);
      this.currentAudio.setVolume(0);
      this.currentAudio.play();
    });
    const volume = { value: this.currentAudio.getVolume() };
    gsap.to(volume, {
      value: 0.5,
      onUpdate: () => {
        this.currentAudio.setVolume(volume.value);
      },
      ease: "power2.inOut",
      duration: 1,
    });
  }

  playTVSwitch() {
    if (this.currentMusic.isPlaying) {
      this.currentMusic.stop();
    }
    this.audioLoader.load("./sound/tvSwitch.mp3", (buffer) => {
      this.currentSFX.setBuffer(buffer);
      this.currentSFX.setLoop(false);
      this.currentSFX.setVolume(0.1);
      this.currentSFX.play();
    });
  }

  playCursedScene() {
    this.currentMusic.setLoop(false);
    this.currentMusic.setVolume(1);
    this.currentMusic.play();
    //preload sound
    this.audioLoader.load("./sound/ampouleBrise.mp3", (buffer) => {
      this.currentSFX.setBuffer(buffer);
      this.currentSFX.setLoop(false);
      this.currentSFX.setVolume(2);
    });
  }

  playEndScene() {
    if (this.currentMusic.isPlaying) {
      this.currentMusic.stop();
    }
    this.currentSFX.play();
  }

  playLightFX() {
    this.audioLoader.load("./sound/light1.mp3", (buffer) => {
      this.currentSFX.setBuffer(buffer);
      this.currentSFX.setLoop(false);
      this.currentSFX.setVolume(1);
      this.currentSFX.play();
    });
  }
}
