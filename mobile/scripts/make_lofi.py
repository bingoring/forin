#!/usr/bin/env python3
# Synthesize a calm, quiet ambient loop for the night radio (v38).
# Soft pad chords (Am7 - Fmaj7 - Cmaj7 - Gsus), a low drone, and a whisper of rain-like
# hiss. 32-second seamless loop, mono, gentle level. Not a produced track — a soothing bed.
import numpy as np, wave, sys, os

SR = 22050
LOOP = 32.0
XF = 1.6          # crossfade for a seamless loop
TOTAL = LOOP + XF
n = int(TOTAL * SR)
t = np.arange(n) / SR

def pad(freq, amp, start, dur, attack=1.6, release=2.6):
    """A soft pad tone with a slow swell in and out."""
    env = np.zeros(n)
    seg = (t >= start) & (t < start + dur)
    lt = t[seg] - start
    a = np.clip(lt / attack, 0, 1)
    r = np.clip((dur - lt) / release, 0, 1)
    # smootherstep for a gentle, un-clicky envelope
    e = np.minimum(a, r)
    e = e * e * (3 - 2 * e)
    env[seg] = e
    tone = (np.sin(2*np.pi*freq*t)
            + 0.28*np.sin(2*np.pi*2*freq*t)
            + 0.12*np.sin(2*np.pi*3*freq*t))
    return amp * env * tone

# Each chord swells for ~9s so its release overlaps the next chord's attack.
CHORDS = [
    (0.0,  [110.00, 164.81, 196.00, 261.63]),  # Am7:   A2 E3 G3 C4
    (8.0,  [ 87.31, 174.61, 220.00, 261.63]),  # Fmaj7: F2 F3 A3 C4
    (16.0, [130.81, 196.00, 246.94, 329.63]),  # Cmaj7: C3 G3 B3 E4
    (24.0, [ 98.00, 146.83, 196.00, 293.66]),  # Gsus:  G2 D3 G3 D4
]

audio = np.zeros(n)
for start, freqs in CHORDS:
    for i, f in enumerate(freqs):
        amp = 0.11 if i == 0 else 0.055   # root a touch louder than the upper voices
        audio += pad(f, amp, start, 9.0)

# Low drone (A1), breathing slowly.
audio += 0.045 * np.sin(2*np.pi*55.0*t) * (0.55 + 0.45*np.sin(2*np.pi*0.05*t))

# A whisper of rain: soft, slightly smoothed hiss, slowly undulating, very quiet.
rng = np.random.default_rng(7)
noise = rng.standard_normal(n)
k = 5
noise = np.convolve(noise, np.ones(k)/k, mode='same')
audio += 0.012 * noise * (0.6 + 0.4*np.sin(2*np.pi*0.07*t + 1.0))

# Seamless loop: blend the tail overlap back into the head.
loopn = int(LOOP * SR)
xn = int(XF * SR)
fade = np.linspace(0, 1, xn)
out = audio[:loopn].copy()
out[:xn] = out[:xn] * fade + audio[loopn:loopn+xn] * (1 - fade)

# Quiet, warm level: normalize to a gentle peak.
peak = np.max(np.abs(out)) or 1.0
out = out / peak * 0.26
pcm = np.int16(np.clip(out, -1, 1) * 32767)

dest = sys.argv[1]
os.makedirs(os.path.dirname(dest), exist_ok=True)
with wave.open(dest, 'w') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", dest, round(os.path.getsize(dest)/1024/1024, 2), "MB", round(loopn/SR, 1), "s loop")
