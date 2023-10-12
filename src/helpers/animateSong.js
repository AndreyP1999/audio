export class AnimateSong {
    #audioContext = null;
    #analyser = null
    #audioSource = null
    constructor(audioElement, particles) {
        this.audioElement = audioElement
        this.particles = particles
    }

    preparation = () => {
        this.#audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.#analyser = this.#audioContext.createAnalyser();
        this.#audioSource = this.#audioContext.createMediaElementSource(this.audioElement);
        this.#audioSource.connect(this.#analyser);
        this.#audioSource.connect(this.#audioContext.destination);
    }

    animateMusic = () => {
        if (!this.audioElement.paused) {
            window.requestAnimationFrame(this.animateMusic)
        }
        const array = new Uint8Array(this.#analyser.frequencyBinCount)
        this.#analyser.getByteFrequencyData(array)
   
        this.particles.style = `width:${500 + array[40]}px`;
    }
}






