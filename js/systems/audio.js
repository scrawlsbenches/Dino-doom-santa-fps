/**
 * Dino Doom: Santa's Last Stand
 * Audio System
 *
 * Web Audio API based sound effects.
 */

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let masterVolume = 1.0;

/**
 * Initializes the audio context
 */
export function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioCtx();
    }
    // Resume suspended audio context (browser autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

/**
 * Gets the audio context
 * @returns {AudioContext|null} The audio context
 */
export function getAudioContext() {
    return audioCtx;
}

/**
 * Plays a sound effect
 * @param {string} type - Sound type identifier
 */
export function playSound(type) {
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch (type) {
            case 'shoot':
                osc.frequency.setValueAtTime(200, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
                break;

            case 'hit':
                osc.frequency.setValueAtTime(400, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
                break;

            case 'kill':
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.15 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
                break;

            case 'damage':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.3 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
                break;

            case 'buy':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.1);
                osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
                break;

            case 'minigame_hit':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
                break;

            case 'boss':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.3 * masterVolume, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.5);
                break;

            case 'moai':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.4 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
                break;

            case 'doot':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(392, audioCtx.currentTime); // G4
                osc.frequency.setValueAtTime(349, audioCtx.currentTime + 0.1); // F4
                gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
                break;

            case 'doot_kill':
                osc.type = 'square';
                osc.frequency.setValueAtTime(523, audioCtx.currentTime); // C5
                osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2); // G5
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.35);
                break;

            case 'achievement':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, audioCtx.currentTime); // C5
                osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2); // G5
                osc.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.3); // C6
                gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.5);
                break;

            case 'gamer_attack':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
                osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.25);
                break;

            case 'heal':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.2);
                osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.4);
                break;

            case 'equip':
                // Weapon equip sound - satisfying click + swoosh (UX-009)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
                osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
                break;

            case 'heal_ready':
                // Healing power ready notification (UX-006)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, audioCtx.currentTime);  // C5
                osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);  // E5
                osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);  // G5
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.35);
                break;

            case 'shop_available':
                // Shop available cha-ching sound (UX-003)
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
                osc.frequency.setValueAtTime(1500, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.25);
                break;

            case 'boss_phase2':
                // TASK-020: Phase 2 transition - menacing power-up
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(80, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.3);
                osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.3 * masterVolume, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.4 * masterVolume, audioCtx.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.8);
                // Play additional warning tone
                playBossPhaseWarning();
                break;

            case 'boss_phase3':
                // TASK-020: Phase 3 transition - epic ascension
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(60, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.5);
                osc.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.8);
                osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 1.0);
                gain.gain.setValueAtTime(0.35 * masterVolume, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.45 * masterVolume, audioCtx.currentTime + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 1.2);
                // Play epic ascension chord
                playBossAscensionChord();
                break;
        }
    } catch {
        // Graceful degradation - game continues without sound
    }
}

/**
 * Plays hit marker sound
 * @param {boolean} isCrit - Whether this was a critical hit
 */
export function playHitMarkerSound(isCrit = false) {
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (isCrit) {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            osc.frequency.setValueAtTime(1600, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } else {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15 * masterVolume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        }
    } catch {
        // Graceful degradation - game continues without sound
    }
}

/**
 * Plays kill streak sound
 * @param {number} streakCount - Current streak count
 */
export function playKillStreakSound(streakCount) {
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const baseFreq = 400 + (streakCount * 100);
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
        osc.frequency.setValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(baseFreq * 2, audioCtx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch {
        // Graceful degradation - game continues without sound
    }
}

// ==================== VOLUME CONTROL ====================

/**
 * Gets the current master volume
 * @returns {number} Volume level (0.0 to 1.0)
 */
export function getVolume() {
    return masterVolume;
}

/**
 * Sets the master volume
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export function setVolume(volume) {
    masterVolume = Math.max(0, Math.min(1, volume));
}

// ==================== MLG SOUND PACK ====================

/**
 * Plays "OH BABY A TRIPLE" sound for triple kills
 * Synthesized voice-like effect using frequency modulation
 */
export function playTripleKillSound() {
    if (!audioCtx) return;

    try {
        // Create a series of tones that mimic "OH BABY A TRIPLE"
        const notes = [
            { freq: 300, dur: 0.15 },  // OH
            { freq: 400, dur: 0.15 },  // BA
            { freq: 350, dur: 0.15 },  // BY
            { freq: 280, dur: 0.15 },  // A
            { freq: 500, dur: 0.12 },  // TRI
            { freq: 450, dur: 0.12 },  // PLE
            { freq: 400, dur: 0.25 }   // (end)
        ];

        let time = audioCtx.currentTime;
        notes.forEach(note => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.freq, time);
            osc.frequency.linearRampToValueAtTime(note.freq * 0.9, time + note.dur * 0.8);

            gain.gain.setValueAtTime(0.25 * masterVolume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + note.dur);

            osc.start(time);
            osc.stop(time + note.dur);
            time += note.dur * 0.9;
        });
    } catch {
        // Graceful degradation - game continues without sound
    }
}

/**
 * Plays MLG airhorn sound for wave complete
 * Classic airhorn synthesized with oscillators
 */
export function playAirhorn() {
    if (!audioCtx) return;

    try {
        // Main horn tone
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const osc3 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(audioCtx.destination);

        // Airhorn chord (A4, C#5, E5 - A major chord)
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(440, audioCtx.currentTime);  // A4
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(554, audioCtx.currentTime);  // C#5
        osc3.type = 'sawtooth';
        osc3.frequency.setValueAtTime(659, audioCtx.currentTime);  // E5

        gain.gain.setValueAtTime(0.3 * masterVolume, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.35 * masterVolume, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

        osc1.start();
        osc2.start();
        osc3.start();
        osc1.stop(audioCtx.currentTime + 0.8);
        osc2.stop(audioCtx.currentTime + 0.8);
        osc3.stop(audioCtx.currentTime + 0.8);
    } catch {
        // Graceful degradation - game continues without sound
    }
}

/**
 * Plays "MOM GET THE CAMERA" sound for 5+ kill streaks
 * Synthesized excited voice effect
 */
export function playMomGetTheCamera() {
    if (!audioCtx) return;

    try {
        // Create excited voice-like tones for "MOM GET THE CAMERA"
        const notes = [
            { freq: 350, dur: 0.12 },  // MOM
            { freq: 400, dur: 0.10 },  // GET
            { freq: 380, dur: 0.10 },  // THE
            { freq: 450, dur: 0.12 },  // CA
            { freq: 500, dur: 0.10 },  // ME
            { freq: 550, dur: 0.15 },  // RA
            { freq: 600, dur: 0.30 }   // ! (rising excitement)
        ];

        let time = audioCtx.currentTime;
        notes.forEach((note, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'square';
            // Rising pitch for excitement
            osc.frequency.setValueAtTime(note.freq + (i * 20), time);
            osc.frequency.linearRampToValueAtTime(note.freq * 1.1 + (i * 25), time + note.dur);

            gain.gain.setValueAtTime(0.2 * masterVolume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + note.dur);

            osc.start(time);
            osc.stop(time + note.dur);
            time += note.dur * 0.85;
        });
    } catch {
        // Graceful degradation - game continues without sound
    }
}

/**
 * Plays sad violin sound for player death
 * Mournful descending melody
 */
export function playSadViolin() {
    if (!audioCtx) return;

    try {
        // Sad descending melody (minor key feel)
        const notes = [
            { freq: 659, dur: 0.4 },   // E5
            { freq: 587, dur: 0.4 },   // D5
            { freq: 523, dur: 0.4 },   // C5
            { freq: 494, dur: 0.6 },   // B4
            { freq: 440, dur: 0.8 }    // A4 (long sad ending)
        ];

        let time = audioCtx.currentTime;
        notes.forEach(note => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            // Add vibrato with LFO
            const vibrato = audioCtx.createOscillator();
            const vibratoGain = audioCtx.createGain();
            vibrato.frequency.setValueAtTime(5, time);  // 5Hz vibrato
            vibratoGain.gain.setValueAtTime(8, time);   // 8Hz depth
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, time);
            // Slight pitch bend down for sadness
            osc.frequency.linearRampToValueAtTime(note.freq * 0.98, time + note.dur);

            // Violin-like envelope
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.2 * masterVolume, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.15 * masterVolume, time + note.dur * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.01, time + note.dur);

            vibrato.start(time);
            osc.start(time);
            vibrato.stop(time + note.dur);
            osc.stop(time + note.dur);
            time += note.dur * 0.9;
        });
    } catch {
        // Graceful degradation - game continues without sound
    }
}

/**
 * Plays "WOW" sound for boss defeat
 * Deep impressed voice effect
 */
export function playWowSound() {
    if (!audioCtx) return;

    try {
        // Create "WOW" sound with frequency sweep
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        // Main tone with formant-like sweep
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc1.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.2);  // W
        osc1.frequency.linearRampToValueAtTime(250, audioCtx.currentTime + 0.4);  // O
        osc1.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.6);  // W

        // Harmonic
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc2.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
        osc2.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 0.4);
        osc2.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);

        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.7);
        osc2.stop(audioCtx.currentTime + 0.7);
    } catch {
        // Graceful degradation - game continues without sound
    }
}

// ==================== TASK-020: BOSS PHASE SOUNDS ====================

/**
 * TASK-020: Plays warning tone for phase 2 transition
 */
function playBossPhaseWarning() {
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'square';
        // Warning beeps
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(0, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.2 * masterVolume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    } catch {
        // Graceful degradation
    }
}

/**
 * TASK-020: Plays epic ascension chord for phase 3 transition
 */
function playBossAscensionChord() {
    if (!audioCtx) return;

    try {
        // Epic minor chord with rising sweep (D minor - dramatic)
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const osc3 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(audioCtx.destination);

        // D minor chord with rising pitch
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(147, audioCtx.currentTime);  // D3
        osc1.frequency.linearRampToValueAtTime(294, audioCtx.currentTime + 0.8);  // D4

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(175, audioCtx.currentTime);  // F3
        osc2.frequency.linearRampToValueAtTime(349, audioCtx.currentTime + 0.8);  // F4

        osc3.type = 'sawtooth';
        osc3.frequency.setValueAtTime(220, audioCtx.currentTime);  // A3
        osc3.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.8);  // A4

        gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.35 * masterVolume, audioCtx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);

        osc1.start();
        osc2.start();
        osc3.start();
        osc1.stop(audioCtx.currentTime + 1.0);
        osc2.stop(audioCtx.currentTime + 1.0);
        osc3.stop(audioCtx.currentTime + 1.0);
    } catch {
        // Graceful degradation
    }
}
