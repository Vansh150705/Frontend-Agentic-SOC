import { useRef } from "react";

export function useAlertSound() {
  const audioCtx = useRef(null);

  function playAlert() {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtx.current;

      // Create two beeps
      [0, 0.3].forEach((delay) => {
        const oscillator = ctx.createOscillator();
        const gainNode   = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type      = "sine";
        oscillator.frequency.setValueAtTime(880, ctx.currentTime + delay);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);

        oscillator.start(ctx.currentTime + delay);
        oscillator.stop(ctx.currentTime + delay + 0.3);
      });
    } catch (e) {
      console.warn("Alert sound failed:", e);
    }
  }

  return { playAlert };
}