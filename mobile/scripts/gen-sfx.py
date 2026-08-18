#!/usr/bin/env python3
"""Generate forin's UI sounds as 8-bit-style WAVs.

Why generated and not sourced: the app is drawn as pixel art, and a chiptune
blip is the sound equivalent of that — a square wave with a fast decay. Writing
them here means the set is reproducible (rerun this and get byte-identical
files), carries no licence questions, and stays tiny (a few KB each) instead of
shipping compressed audio for sounds that are 100ms long.

Run: python3 scripts/gen-sfx.py
"""
import math
import struct
import wave
from pathlib import Path

RATE = 22050          # plenty for square waves; halves the file size vs 44.1k
OUT = Path(__file__).resolve().parent.parent / "assets" / "sfx"


def square(freq, ms, amp=0.22, duty=0.5):
    """One square-wave tone with an exponential decay, so it clicks rather than
    beeps — a sustained square at UI volume is fatiguing."""
    n = int(RATE * ms / 1000)
    out = []
    period = RATE / freq
    for i in range(n):
        env = math.exp(-4.0 * i / n)          # fast decay
        v = amp if (i % period) < period * duty else -amp
        out.append(v * env)
    return out


def silence(ms):
    return [0.0] * int(RATE * ms / 1000)


def write(name, samples):
    # A short fade on the tail kills the click that a hard cut leaves.
    tail = min(220, len(samples))
    for i in range(tail):
        samples[len(samples) - tail + i] *= 1 - i / tail
    path = OUT / f"{name}.wav"
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32767)) for s in samples))
    return path.name, path.stat().st_size


# Pentatonic-ish steps so several sounds in a row never clash.
A4, C5, D5, E5, G5, A5, C6, E6 = 440, 523, 587, 659, 784, 880, 1047, 1319

SOUNDS = {
    # Every tap. Deliberately the quietest and shortest thing here — it fires
    # most often, and anything longer turns into noise while scrolling a list.
    "tap":     square(A5, 45, amp=0.12),
    # A choice was accepted and something advances.
    "confirm": square(E5, 55) + square(A5, 70),
    # Going back / dismissing: the same shape inverted, so it reads as undo.
    "back":    square(A5, 45) + square(E5, 60),
    # A scenario cleared. The only sound allowed to be a phrase.
    "success": square(C5, 70) + square(E5, 70) + square(G5, 70) + square(C6, 130),
    # A wrong answer. Low and short — not a punishment, just a "no".
    "wrong":   square(196, 90, amp=0.18, duty=0.25) + square(165, 110, amp=0.18, duty=0.25),
    # Streak / reward moment.
    "reward":  square(G5, 55) + square(C6, 55) + square(E6, 150),
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for name, samples in SOUNDS.items():
        fn, size = write(name, list(samples))
        total += size
        print(f"  {fn:14s} {size:6d} B")
    print(f"  총 {total} B")
