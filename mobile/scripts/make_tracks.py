#!/usr/bin/env python3
# Synthesize the night-radio track library (v38).
#
# Three moods, all synthesized (no sampled or copyrighted audio), all seamless loops:
#   1. night-rain.wav   — realistic rain over a soft pad bed (the calm default).
#   2. night-summer.wav — a bright, nostalgic music-box piece in a major key.
#   3. night-waltz.wav  — a wistful 3/4 waltz in a minor key.
#
# The two melodic tracks are ORIGINAL compositions written for a warm/nostalgic mood — they
# are not transcriptions of any existing song. numpy only (no scipy): filters are FIR
# convolutions with an exponential kernel, which is enough for shaping noise and tones.
import numpy as np, wave, sys, os

SR = 22050


# ── helpers ──────────────────────────────────────────────────────────────────
def lp(x, cutoff_hz):
    """One-sided exponential FIR low-pass. cutoff ~ where the roll-off begins."""
    tau = SR / (2 * np.pi * cutoff_hz)
    k = np.exp(-np.arange(0, tau * 6) / tau)
    k /= k.sum()
    return np.convolve(x, k, mode='same')


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def seamless(audio, loop_s, xf_s):
    """Blend the tail overlap back into the head for a click-free loop."""
    loopn, xn = int(loop_s * SR), int(xf_s * SR)
    fade = np.linspace(0, 1, xn)
    out = audio[:loopn].copy()
    out[:xn] = out[:xn] * fade + audio[loopn:loopn + xn] * (1 - fade)
    return out


def write_wav(dest, out, peak_to=0.42):
    peak = np.max(np.abs(out)) or 1.0
    out = out / peak * peak_to
    pcm = np.int16(np.clip(out, -1, 1) * 32767)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with wave.open(dest, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    dur = len(out) / SR
    print("wrote", os.path.basename(dest), round(os.path.getsize(dest) / 1024 / 1024, 2),
          "MB", round(dur, 1), "s")


def pad(t, freq, amp, start, dur, attack=1.6, release=2.6):
    """A soft swelling pad tone (used as the bed under every track)."""
    n = len(t)
    env = np.zeros(n)
    seg = (t >= start) & (t < start + dur)
    lt = t[seg] - start
    a = np.clip(lt / attack, 0, 1)
    r = np.clip((dur - lt) / release, 0, 1)
    e = np.minimum(a, r)
    e = e * e * (3 - 2 * e)
    env[seg] = e
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.28 * np.sin(2 * np.pi * 2 * freq * t)
            + 0.12 * np.sin(2 * np.pi * 3 * freq * t))
    return amp * env * tone


def musicbox(t, freq, amp, start, dur):
    """A music-box / celesta-ish note: bright bell partials with a fast percussive decay."""
    n = len(t)
    seg = (t >= start) & (t < start + dur)
    lt = t[seg] - start
    # fast attack (~6ms), exponential decay over the note's length
    atk = np.clip(lt / 0.006, 0, 1)
    dec = np.exp(-lt / (dur * 0.42))
    env = atk * dec
    out = np.zeros(n)
    partials = [(1.0, 1.0), (2.0, 0.5), (3.01, 0.25), (4.02, 0.12), (5.4, 0.06)]
    sig = np.zeros(np.count_nonzero(seg))
    lts = t[seg]
    for mult, a in partials:
        sig += a * np.sin(2 * np.pi * freq * mult * lts)
    out[seg] = amp * env * sig
    return out


# ── track 1: rain over a pad bed ─────────────────────────────────────────────
def make_rain(dest):
    LOOP, XF = 32.0, 1.6
    n = int((LOOP + XF) * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(11)

    # The rain itself. White noise sounds like static; rain is darker, with a granular
    # texture (many overlapping droplet impacts) and audible patter transients.
    white = rng.standard_normal(n)
    # Real rain sits around 2–3 kHz, not the bright top where white noise reads as static.
    body = lp(white, 2400)               # roll the harsh top well off
    body = body - 0.6 * lp(white, 90)    # thin the sub rumble, but keep low-mid warmth
    # Granular density: a slowly + quickly varying positive envelope makes it shimmer and
    # breathe like real rainfall rather than a flat wall of noise.
    dens = lp(np.abs(rng.standard_normal(n)), 22)
    dens = 0.55 + 1.1 * (dens / (dens.mean() + 1e-9)) * 0.5
    body *= dens
    # Patter: sparse short filtered bursts scattered through the loop = individual drops.
    drops = np.zeros(n)
    for _ in range(1400):
        i = rng.integers(0, n - 400)
        L = rng.integers(60, 240)
        env = np.exp(-np.arange(L) / (L * 0.3))
        drops[i:i + L] += rng.standard_normal(L) * env * rng.uniform(0.3, 1.0)
    drops = lp(drops, 2200)
    rain = 0.65 * body + 0.4 * drops
    rain = lp(rain, 4500)                 # a final soft top-end tame over the whole bed
    rain *= (0.85 + 0.15 * np.sin(2 * np.pi * 0.05 * t))  # gentle far/near swell

    # A soft pad bed under the rain (Am7 – Fmaj7 – Cmaj7 – Gsus), kept quiet.
    chords = [
        (0.0,  [110.00, 164.81, 196.00, 261.63]),
        (8.0,  [ 87.31, 174.61, 220.00, 261.63]),
        (16.0, [130.81, 196.00, 246.94, 329.63]),
        (24.0, [ 98.00, 146.83, 196.00, 293.66]),
    ]
    bed = np.zeros(n)
    for start, freqs in chords:
        for i, f in enumerate(freqs):
            bed += pad(t, f, 0.10 if i == 0 else 0.05, start, 9.0)
    bed += 0.04 * np.sin(2 * np.pi * 55.0 * t) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.05 * t))

    audio = 0.5 * rain + bed
    write_wav(dest, seamless(audio, LOOP, XF), peak_to=0.4)


# ── shared: render a melodic piece from a score ──────────────────────────────
def render_piece(dest, loop_s, xf_s, spb, pad_chords, bass, melody, seed=3, rain_amt=0.05):
    """spb = seconds per beat. pad_chords/bass/melody are (beat, midi, dur_beats, amp)."""
    n = int((loop_s + xf_s) * SR)
    t = np.arange(n) / SR
    audio = np.zeros(n)
    for beat, m, durb, amp in pad_chords:
        audio += pad(t, midi(m), amp, beat * spb, durb * spb, attack=0.5, release=1.4)
    for beat, m, durb, amp in bass:
        audio += musicbox(t, midi(m), amp, beat * spb, durb * spb)
    for beat, m, durb, amp in melody:
        audio += musicbox(t, midi(m), amp, beat * spb, durb * spb)
    # a whisper of rain-like air so it sits in the same room as the rain track
    rng = np.random.default_rng(seed)
    air = lp(rng.standard_normal(n), 3000)
    audio += rain_amt * air
    write_wav(dest, seamless(audio, loop_s, xf_s), peak_to=0.5)


# ── track 2: bright nostalgic (Summer-inspired mood; original melody) ─────────
def make_summer(dest):
    # D major, gentle lilt. I–V–vi–IV feel. spb 0.5 (120bpm), 4/4, 16 bars → 32s.
    spb, bar = 0.5, 4
    # chord voicings per 2-bar block (root, third, fifth, sometimes 7/9)
    blocks = [
        [62, 66, 69, 73],  # D  (D F# A C#)
        [69, 73, 76, 81],  # A  (A C# E A)
        [71, 74, 78, 81],  # Bm (B D F# A)
        [67, 71, 74, 78],  # G  (G B D F#)
    ]
    pad_chords, bass = [], []
    for blk in range(8):  # 8 two-bar blocks = 16 bars
        ch = blocks[blk % 4]
        b0 = blk * 2 * bar
        for v in ch:
            pad_chords.append((b0, v, 2 * bar, 0.035))
        root = ch[0] - 12
        # simple root–fifth bass on the downbeats
        bass += [(b0, root, 1.4, 0.12), (b0 + 2, root + 7, 1.4, 0.10),
                 (b0 + 4, root, 1.4, 0.12), (b0 + 6, root + 7, 1.4, 0.10)]
    # ORIGINAL melody (scale degrees over D major), warm and stepwise with small leaps.
    D = [62, 64, 66, 67, 69, 71, 73, 74, 76, 78]  # D E F# G A B C# D E F#
    seq = [
        # beat, index into a running motif, dur
        (0, 74, 1), (1, 73, 1), (2, 69, 1.5), (3.5, 71, 0.5),
        (4, 73, 2), (6, 69, 1), (7, 66, 1),
        (8, 69, 1), (9, 71, 1), (10, 73, 1.5), (11.5, 74, 0.5),
        (12, 76, 2), (14, 73, 2),
        (16, 78, 1), (17, 76, 1), (18, 73, 1.5), (19.5, 74, 0.5),
        (20, 76, 2), (22, 74, 1), (23, 71, 1),
        (24, 73, 1), (25, 74, 1), (26, 76, 1.5), (27.5, 73, 0.5),
        (28, 74, 3), (31, 69, 1),
        (32, 74, 1), (33, 73, 1), (34, 69, 1.5), (35.5, 71, 0.5),
        (36, 73, 2), (38, 69, 2),
        (40, 71, 1), (41, 73, 1), (42, 74, 1.5), (43.5, 76, 0.5),
        (44, 73, 2), (46, 69, 2),
        (48, 78, 1), (49, 76, 1), (50, 74, 1.5), (51.5, 73, 0.5),
        (52, 74, 2), (54, 76, 2),
        (56, 73, 1), (57, 71, 1), (58, 69, 1.5), (59.5, 67, 0.5),
        (60, 66, 2), (62, 62, 2),
    ]
    melody = [(b, mnote, d, 0.16) for (b, mnote, d) in seq]
    render_piece(dest, loop_s=64 * spb, xf_s=1.2, spb=spb,
                 pad_chords=pad_chords, bass=bass, melody=melody, seed=5, rain_amt=0.045)


# ── track 3: wistful waltz (Merry-Go-Round-inspired mood; original melody) ────
def make_waltz(dest):
    # A minor, 3/4. spb 0.55, bar = 3 beats. 18 bars → ~29.7s.
    spb, bar = 0.55, 3
    # progression (one chord per bar): Am Dm G C  F Dm E Am  (a nostalgic circle)
    prog = [
        [57, 60, 64],  # Am
        [62, 65, 69],  # Dm
        [55, 59, 62],  # G
        [60, 64, 67],  # C
        [53, 57, 60],  # F
        [62, 65, 69],  # Dm
        [52, 56, 59],  # E
        [57, 60, 64],  # Am
        [57, 60, 64],  # Am (turnaround)
    ]
    pad_chords, bass = [], []
    for i in range(18):
        ch = prog[i % 9]
        b0 = i * bar
        for v in ch:
            pad_chords.append((b0, v, bar, 0.03))
        # oom-pah-pah: bass root on 1, chord stabs on 2 and 3
        bass.append((b0, ch[0] - 12, 0.9, 0.13))
        bass.append((b0 + 1, ch[1], 0.7, 0.06))
        bass.append((b0 + 2, ch[2], 0.7, 0.06))
    # ORIGINAL melody over A minor (with the raised 7th, G#, for the wistful turn).
    seq = [
        (0, 69, 2), (2, 72, 1),
        (3, 71, 2), (5, 69, 1),
        (6, 67, 2), (8, 65, 1),
        (9, 64, 3),
        (12, 65, 2), (14, 67, 1),
        (15, 69, 2), (17, 71, 1),
        (18, 72, 2), (20, 71, 1),
        (21, 69, 3),
        (24, 69, 2), (26, 68, 1),   # G# leading tone
        (27, 69, 2), (29, 72, 1),
        (30, 74, 2), (32, 72, 1),
        (33, 71, 3),
        (36, 72, 2), (38, 69, 1),
        (39, 68, 2), (41, 69, 1),
        (42, 71, 2), (44, 67, 1),
        (45, 69, 3),
        (48, 64, 2), (50, 65, 1),
        (51, 67, 2), (53, 69, 1),
    ]
    melody = [(b, mnote, d, 0.15) for (b, mnote, d) in seq]
    render_piece(dest, loop_s=54 * spb, xf_s=1.2, spb=spb,
                 pad_chords=pad_chords, bass=bass, melody=melody, seed=9, rain_amt=0.04)


if __name__ == '__main__':
    outdir = sys.argv[1] if len(sys.argv) > 1 else 'assets/audio'
    make_rain(os.path.join(outdir, 'night-rain.wav'))
    make_summer(os.path.join(outdir, 'night-summer.wav'))
    make_waltz(os.path.join(outdir, 'night-waltz.wav'))
