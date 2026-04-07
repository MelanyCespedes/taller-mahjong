import { useCallback, useRef } from 'react';

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback((
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.25,
    startAt = 0,
  ) => {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const vol = ac.createGain();
    osc.connect(vol);
    vol.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
    vol.gain.setValueAtTime(gain, ac.currentTime + startAt);
    vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startAt + duration);
    osc.start(ac.currentTime + startAt);
    osc.stop(ac.currentTime + startAt + duration);
  }, [getCtx]);

  /** Short click when a tile is flipped */
  const playFlip = useCallback(() => {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const vol = ac.createGain();
    osc.connect(vol);
    vol.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ac.currentTime + 0.08);
    vol.gain.setValueAtTime(0.2, ac.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.08);
  }, [getCtx]);

  /** Two ascending chime notes on a successful match */
  const playMatch = useCallback(() => {
    tone(523, 0.18, 'sine', 0.3, 0);
    tone(784, 0.28, 'sine', 0.3, 0.16);
  }, [tone]);

  /** Low descending buzz on a failed match */
  const playNoMatch = useCallback(() => {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const vol = ac.createGain();
    osc.connect(vol);
    vol.connect(ac.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ac.currentTime + 0.3);
    vol.gain.setValueAtTime(0.15, ac.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.3);
  }, [getCtx]);

  /** Ascending 4-note fanfare on game over */
  const playVictory = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      tone(freq, 0.35, 'sine', 0.3, i * 0.18);
    });
  }, [tone]);

  return { playFlip, playMatch, playNoMatch, playVictory };
}
