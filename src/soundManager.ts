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
    this.audioLoader.load("./sound/nightmare.mp3", (buffer) => {
      this.currentMusic.setBuffer(buffer);
    });
  }

  playIntro() {
    console.log("intro");
    this.audioLoader.load("./sound/car.mp3", (buffer) => {
      this.currentAudio.setBuffer(buffer);
      this.currentAudio.setLoop(false);
      this.currentAudio.setVolume(0.8);
      this.currentAudio.play();
    });
  }

  sceneLoaded() {
    console.log("sceneLoaded");
    if (this.currentAudio.isPlaying) {
      console.log("current audio is playing");

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
  }

  playEndScene() {
    if (this.currentMusic.isPlaying) {
      this.currentMusic.stop();
    }
    // this.audioLoader.load("./sound/nightmare.mp3", (buffer) => {
    //   this.currentMusic.setBuffer(buffer);
    //   this.currentMusic.setLoop(false);
    //   this.currentMusic.setVolume(0.8);
    //   this.currentMusic.play();
    // });
  }
}
