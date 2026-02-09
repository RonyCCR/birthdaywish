
/**
 * Programmatic audio utilities for the birthday experience.
 * Uses Web Audio API to ensure zero external dependencies.
 */

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Plays a subtle high-end "tick" sound for the countdown.
 */
export const playTick = () => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio playback blocked or failed", e);
  }
};

/**
 * Plays a "celebration blast" sound (pop + shimmer).
 */
export const playBlast = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;

    // Pop sound (low thud)
    const osc = ctx.createOscillator();
    const popGain = ctx.createGain();
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    popGain.gain.setValueAtTime(0.3, now);
    popGain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.connect(popGain);
    popGain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.3);

    // Shimmer/Confetti Noise
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(5000, now + 1.0);

    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    console.warn("Celebration audio blocked or failed", e);
  }
};
