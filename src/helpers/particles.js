import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
export class Particle {
    #scene = new THREE.Scene();
    #camera = null
    #renderer = null
    #particles = null
    #analyser = null
    #material = null
    #mouseX = 0
    #mouseY = 0;
    constructor(window, vr_enable) {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.innerWidth = window.innerWidth
        this.innerHeight = window.innerHeight
        this.vr_enable = vr_enable
    }
    #createRenderer = (window) => {
        this.#renderer = new THREE.WebGLRenderer({ antialias: true });
        this.#renderer.setPixelRatio(window.devicePixelRatio);
        this.#renderer.setSize(this.innerWidth, this.innerHeight);
        if (this.vr_enable) {
            window.document.body.appendChild(VRButton.createButton(this.#renderer));
        }
        else {
            window.document.body.appendChild(this.#renderer.domElement);
        }
    }
    createListener = (path) => {
        const listener = new THREE.AudioListener();
        const audio = new THREE.Audio(listener);
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            const loader = new THREE.AudioLoader();
            loader.load(path, function (buffer) {
                audio.setBuffer(buffer);
                audio.play();
            });

        } else {
            const mediaElement = new Audio(path);
            mediaElement.play();
            audio.setMediaElementSource(mediaElement);
        }
        const fftSize = 128;
        this.#analyser = new THREE.AudioAnalyser(audio, fftSize);

    }
    createCamera = (window) => {
        this.#camera = new THREE.PerspectiveCamera(45, this.innerWidth / this.innerHeight, 2, 2000);
        this.#camera.position.z = 1000;

        this.#createRenderer(window)
        window.document.body.addEventListener('pointermove', (event) => {
            if (event.isPrimary === false) return;
            this.#mouseX = event.clientX - this.windowHalfX;
            this.#mouseY = event.clientY - this.windowHalfY;
        });
        window.addEventListener('resize', (event) => {
            this.windowHalfX = this.innerWidth / 2;
            this.windowHalfY = this.innerHeight / 2;

            this.#camera.aspect = this.innerWidth / this.innerHeight;
            this.#camera.updateProjectionMatrix();

            this.#renderer.setSize(this.innerWidth, this.innerHeight);

        });
        this.#scene.fog = new THREE.FogExp2(0x176B87, 0.001);
    }

    createParticles = (texture) => {
        const geometry = new THREE.BufferGeometry();
        let vertices = [];
        const sprite = new THREE.TextureLoader().load(texture);
        sprite.colorSpace = THREE.SRGBColorSpace;
        for (let i = 0; i < 10000; i++) {
            const x = 2000 * Math.random() - 1000;
            const y = 2000 * Math.random() - 1000;
            const z = 2000 * Math.random() - 1000;
            vertices.push(x, y, z);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.#material = new THREE.PointsMaterial({ size: 25, map: sprite, alphaTest: 0.5, transparent: true });

        this.#material.color.setHSL(1.0, 0.3, 0.7, THREE.SRGBColorSpace);
        this.#particles = new THREE.Points(geometry, this.#material);

        this.#scene.add(this.#particles);

    }
    animate = () => {

        if (this.vr_enable) {
            this.#renderer.xr.enabled = true;
            this.#renderer.setAnimationLoop(() => {
                this.#render()
                // setInterval(() => {
                //     this.#render()
                // }, 5000);
            })
        }


        else {
            requestAnimationFrame(this.animate);
            this.#render();

        }

    }
    #render = () => {



        const data = this.#analyser.getAverageFrequency();

        this.#material.size = data / 4


        const time = Date.now() * 0.00005;
        this.#camera.position.x += (this.#mouseX - this.#camera.position.x) * 0.05;
        this.#camera.position.y += (- this.#mouseY - this.#camera.position.y) * 0.05;
        this.#camera.lookAt(this.#scene.position);
        const h = (360 * (1.0 + time) % 360) / 360;
        this.#material.color.setHSL(h, 0.5, 0.5);
        this.#renderer.render(this.#scene, this.#camera);

    }
}












