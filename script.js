/* ===================================================================
   🌸 YASHI'S 20TH BIRTHDAY SURPRISE - JAVASCRIPT 🌸
   Interactive Logic, Canvas Particles, 3D Animations & Web Audio Synthesizer
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (Pure Client-Side Sound, Zero Dependencies)
  // -----------------------------------------------------------------
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicInterval = null;
  let musicStep = 0;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play a soft, pleasant chime tone
  function playTone(freq, type = 'sine', duration = 0.35, gainVal = 0.15) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  // Sound effects
  const soundEffects = {
    click: () => playTone(650, 'sine', 0.12, 0.08),
    error: () => {
      playTone(280, 'triangle', 0.2, 0.12);
      setTimeout(() => playTone(240, 'triangle', 0.25, 0.12), 120);
    },
    unlock: () => {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'sine', 0.45, 0.18), i * 110);
      });
    },
    blowCandle: () => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        // Soft breath sound with noise/filter
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        setTimeout(() => playTone(880, 'sine', 0.4, 0.1), 300);
      } catch (e) {}
    },
    giftOpen: () => {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 'sine', 0.4, 0.15), idx * 90);
      });
    },
    envelope: () => {
      playTone(587.33, 'triangle', 0.25, 0.12);
      setTimeout(() => playTone(739.99, 'sine', 0.35, 0.15), 140);
    },
    flip: () => playTone(440, 'triangle', 0.15, 0.08),
    pop: () => playTone(987.77, 'sine', 0.15, 0.15)
  };

  // Music Box Melody: "Happy Birthday to You" notes
  const birthdayMelodyNotes = [
    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.2 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.8 },
    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.2 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 0.8 },
    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.2 }, { f: 523.25, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 293.66, d: 0.6 },
    { f: 466.16, d: 0.3 }, { f: 466.16, d: 0.2 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 1.0 }
  ];

  function toggleMusic() {
    getAudioContext();
    const btn = document.getElementById('musicToggleBtn');
    if (isMusicPlaying) {
      clearInterval(musicInterval);
      isMusicPlaying = false;
      btn.classList.remove('playing');
    } else {
      isMusicPlaying = true;
      btn.classList.add('playing');
      musicStep = 0;
      playNextNote();
    }
  }

  function playNextNote() {
    if (!isMusicPlaying) return;
    const note = birthdayMelodyNotes[musicStep];
    playTone(note.f, 'sine', note.d * 1.1, 0.12);
    // Add harmonic soft bell overtone
    setTimeout(() => playTone(note.f * 2, 'sine', 0.2, 0.04), 20);
    
    musicStep = (musicStep + 1) % birthdayMelodyNotes.length;
    musicInterval = setTimeout(playNextNote, note.d * 1000 + 150);
  }

  const musicBtn = document.getElementById('musicToggleBtn');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }


  // -----------------------------------------------------------------
  // 2. SECRET PASSWORD SCREEN LOGIC
  // -----------------------------------------------------------------
  const digit1 = document.getElementById('digit1');
  const digit2 = document.getElementById('digit2');
  const unlockBtn = document.getElementById('unlockBtn');
  const errorMessage = document.getElementById('errorMessage');
  const passwordOverlay = document.getElementById('passwordOverlay');
  const mainSurpriseContent = document.getElementById('mainSurpriseContent');

  // Input auto-advance & navigation
  digit1.addEventListener('input', (e) => {
    soundEffects.click();
    if (digit1.value.length >= 1) {
      digit1.value = digit1.value.slice(-1);
      digit2.focus();
    }
    clearError();
  });

  digit2.addEventListener('input', (e) => {
    soundEffects.click();
    if (digit2.value.length >= 1) {
      digit2.value = digit2.value.slice(-1);
    }
    clearError();
  });

  digit2.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && digit2.value === '') {
      digit1.focus();
    } else if (e.key === 'Enter') {
      validatePassword();
    }
  });

  digit1.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (digit2.value) {
        validatePassword();
      } else {
        digit2.focus();
      }
    }
  });

  unlockBtn.addEventListener('click', validatePassword);

  function clearError() {
    errorMessage.textContent = '';
    const lockCard = document.querySelector('.lock-card');
    if (lockCard) lockCard.classList.remove('shake');
  }

  function validatePassword() {
    const val1 = digit1.value.trim();
    const val2 = digit2.value.trim();
    const entered = val1 + val2;

    // Must be exactly "07"
    if (entered === "07") {
      handleSuccessUnlock();
    } else {
      handleWrongPassword(entered);
    }
  }

  function handleWrongPassword(entered) {
    soundEffects.error();
    const lockCard = document.querySelector('.lock-card');
    lockCard.classList.remove('shake');
    void lockCard.offsetWidth; // trigger reflow
    lockCard.classList.add('shake');

    if (entered === "7") {
      errorMessage.textContent = "Almost! Remember it's a 2-digit number (07) 💕";
    } else if (entered.length < 2) {
      errorMessage.textContent = "Please enter both digits, sweet girl! ✨";
    } else {
      const playfulMessages = [
        "Oops! That's not the magic number, try again! 💕",
        "Hmm, not quite! Think of that special number... 🎀",
        "Close! Try again, birthday girl! 💗"
      ];
      const randomMsg = playfulMessages[Math.floor(Math.random() * playfulMessages.length)];
      errorMessage.textContent = randomMsg;
    }

    digit1.value = '';
    digit2.value = '';
    digit1.focus();
  }

  function handleSuccessUnlock() {
    soundEffects.unlock();
    clearError();

    // Trigger massive celebratory confetti explosion
    triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2, 140);

    // Smooth unlock animation
    passwordOverlay.classList.add('unlocked');
    mainSurpriseContent.classList.remove('hidden');

    // Auto-start ambient melody after user interaction
    setTimeout(() => {
      if (!isMusicPlaying) {
        toggleMusic();
      }
    }, 600);

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // -----------------------------------------------------------------
  // 3. INTERACTIVE 20TH BIRTHDAY CAKE & CANDLE BLOWING
  // -----------------------------------------------------------------
  const birthdayCake = document.getElementById('birthdayCake');
  const candle1 = document.getElementById('candle1');
  const candle2 = document.getElementById('candle2');
  const wishBanner = document.getElementById('wishBanner');
  let areCandlesBlown = false;

  function blowOutCandles() {
    if (!areCandlesBlown) {
      areCandlesBlown = true;
      soundEffects.blowCandle();

      candle1.classList.add('blown-out');
      candle2.classList.add('blown-out');

      // Confetti burst from cake position
      const rect = birthdayCake.getBoundingClientRect();
      triggerConfettiExplosion(rect.left + rect.width / 2, rect.top + 40, 80);

      // Reveal wish banner with soft animation
      setTimeout(() => {
        wishBanner.classList.remove('hidden');
      }, 400);
    } else {
      // Relight candles if clicked again
      soundEffects.click();
      areCandlesBlown = false;
      candle1.classList.remove('blown-out');
      candle2.classList.remove('blown-out');
      wishBanner.classList.add('hidden');
    }
  }

  if (birthdayCake) {
    birthdayCake.addEventListener('click', blowOutCandles);
  }


  // -----------------------------------------------------------------
  // 4. INTERACTIVE 3D ANIMATED ENVELOPE & LETTER
  // -----------------------------------------------------------------
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('waxSeal');
  const envelopeHint = document.getElementById('envelopeHint');
  const letterPaper = document.getElementById('letterPaper');
  const readFullModalBtn = document.getElementById('readFullModalBtn');
  const expandLetterBtn = document.getElementById('expandLetterBtn');
  const secretLetterModal = document.getElementById('secretLetterModal');
  const closeLetterModalBtn = document.getElementById('closeLetterModalBtn');
  const letterModalBackdrop = document.getElementById('letterModalBackdrop');

  function openLetterModal() {
    soundEffects.chime();
    if (secretLetterModal) {
      secretLetterModal.classList.remove('hidden');
      const rect = secretLetterModal.getBoundingClientRect();
      triggerConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 3, 35);
    }
  }

  function closeLetterModal() {
    soundEffects.click();
    if (secretLetterModal) {
      secretLetterModal.classList.add('hidden');
    }
  }

  function toggleEnvelope() {
    soundEffects.envelope();
    envelope.classList.toggle('open');
    if (envelope.classList.contains('open')) {
      envelopeHint.textContent = "Letter opened with love! 💌 (Tap outside to tuck back)";
      if (readFullModalBtn) readFullModalBtn.classList.remove('hidden');
      const rect = envelope.getBoundingClientRect();
      triggerConfettiExplosion(rect.left + rect.width / 2, rect.top, 40);
    } else {
      envelopeHint.textContent = "Tap the wax seal 'Y' to open 💌";
      if (readFullModalBtn) readFullModalBtn.classList.add('hidden');
    }
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEnvelope();
    });
  }

  if (envelope) {
    envelope.addEventListener('click', (e) => {
      toggleEnvelope();
    });
  }

  if (letterPaper) {
    // Prevent clicking the letter paper from immediately closing the envelope
    letterPaper.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!envelope.classList.contains('open')) {
        toggleEnvelope();
      }
    });
  }

  if (expandLetterBtn) {
    expandLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLetterModal();
    });
  }

  if (readFullModalBtn) {
    readFullModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLetterModal();
    });
  }

  if (closeLetterModalBtn) closeLetterModalBtn.addEventListener('click', closeLetterModal);
  if (letterModalBackdrop) letterModalBackdrop.addEventListener('click', closeLetterModal);


  // -----------------------------------------------------------------
  // 6. INTERACTIVE SURPRISE #3: POLAROID GALLERY FLIP & FALLBACKS
  // -----------------------------------------------------------------
  const polaroids = document.querySelectorAll('.polaroid-card-wrap');
  polaroids.forEach(wrap => {
    wrap.addEventListener('click', () => {
      soundEffects.flip();
      const card = wrap.querySelector('.polaroid-card');
      card.classList.toggle('flipped');
    });
  });

  // Offline or broken image graceful fallback
  const samplePastelSVGs = [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23ffe4ec"/><circle cx="200" cy="200" r="90" fill="%23fbcfe8"/><text x="200" y="215" font-size="70" text-anchor="middle">🌸</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fdf2f8"/><circle cx="200" cy="200" r="90" fill="%23fed7aa"/><text x="200" y="215" font-size="70" text-anchor="middle">🎂</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fff1f2"/><circle cx="200" cy="200" r="90" fill="%23fda4af"/><text x="200" y="215" font-size="70" text-anchor="middle">✨</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23ffe4ec"/><circle cx="200" cy="200" r="90" fill="%23f472b6"/><text x="200" y="215" font-size="70" text-anchor="middle">🌷</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fef3c7"/><circle cx="200" cy="200" r="90" fill="%23fde68a"/><text x="200" y="215" font-size="70" text-anchor="middle">🌟</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fce7f3"/><circle cx="200" cy="200" r="90" fill="%23f472b6"/><text x="200" y="215" font-size="70" text-anchor="middle">🎀</text></svg>'
  ];

  document.querySelectorAll('.polaroid-img').forEach((img, idx) => {
    img.addEventListener('error', () => {
      img.src = samplePastelSVGs[idx % samplePastelSVGs.length];
    });
  });


  // -----------------------------------------------------------------
  // 7. INTERACTIVE SURPRISE #4: 20 THINGS WE ADORE ABOUT YASHI
  // -----------------------------------------------------------------
  const reasonsData = [
    { num: 1, text: "Tera confidence alag hi level ki hai har topic pe apni baat rakhni hoti hai pucho matt" },
    { num: 2, text: "Tera humour next level hai tere saath boring conversation hona literally impossible hai" },
    { num: 3, text: "Always stay on Cloud 9 because your happiness and crazy energy are worth protecting" },
    { num: 4, text: "Please try to achieve all your dreams your bucketlst is crazyyy" },
    { num: 5, text: "Kuch naya jaanne ki curiosity toh itni hai ki jab tak answer na mile tab tak baat nahi karni madam ko" },
    { num: 6, text: "Your kidness helps everyone stay kind person always somebody's listener" },
    { num: 7, text: "but please learn doing pranks you are not good at that" },
    { num: 8, text: "Movies aur series ke bina toh tera time pass hi nahi hota aur recommendations bhi khatam nahi hoti" },
    { num: 9, text: "Your voice is genuinely so beautiful and honestly" },
    { num: 10, text: "You're living proof that God has a sense of humour" },
    { num: 11, text: "Bakchodi karne aur ulte seedhe kand karne mein tera koi competition hi nahi hai" },
    { num: 12, text: "Har moment ki photo click karna aur videos aur vlogs banana is literally your favourite thing and ulta baith na" },
    { num: 13, text: "Your crying hobbie deserve an award cause you always cry but you get relief so its okay to cry" },
    { num: 14, text: "Paris aur France ke dreams ek din zaroor pure ho bas waha jaake hume bhool mat jaana" },
    { num: 15, text: "Such a coward always afraid of uncle's hahahahaah" },
    { num: 16, text: "Always P person" },
    { num: 17, text: "Tere cute faces aur gusse wale expressions aur emotional drama sab kuch alag hi level ka hai" },
    { num: 18, text: "steal everyone attension very quickly and won everyone's heart" },
    { num: 19, text: "You're such a little patootie" },
    { num: 20, text: "Simply being YOU the sweetest and most special birthday girl who deserves all the happiness in the world 🎂💕" }
  ];

  const reasonsGrid = document.getElementById('reasonsGrid');
  if (reasonsGrid) {
    reasonsData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'reason-card';
      card.innerHTML = `
        <div class="reason-number">#${item.num}</div>
        <div class="reason-prompt">Tap to reveal 💗</div>
        <div class="reason-text">${item.text}</div>
      `;
      card.addEventListener('click', () => {
        soundEffects.pop();
        card.classList.toggle('revealed');
      });
      reasonsGrid.appendChild(card);
    });
  }


  // -----------------------------------------------------------------
  // 8. SIGN-OFF INTERACTION (07 · forever)
  // -----------------------------------------------------------------
  const foreverSignoff = document.querySelector('.forever-signoff');
  if (foreverSignoff) {
    foreverSignoff.addEventListener('click', () => {
      soundEffects.unlock();
      spawnFloatingHeartBurst();
      const rect = foreverSignoff.getBoundingClientRect();
      triggerConfettiExplosion(rect.left + rect.width / 2, rect.top, 60);
    });
  }

  function spawnFloatingHeartBurst() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💖', '🌸', '✨', '🧸', '🎀', '💗'][Math.floor(Math.random() * 6)];
        heart.style.position = 'fixed';
        heart.style.left = `${Math.random() * 80 + 10}vw`;
        heart.style.bottom = '10vh';
        heart.style.fontSize = `${Math.random() * 24 + 20}px`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
        document.body.appendChild(heart);

        requestAnimationFrame(() => {
          heart.style.transform = `translate(${Math.random() * 60 - 30}px, -${Math.random() * 300 + 350}px) scale(1.4)`;
          heart.style.opacity = '0';
        });

        setTimeout(() => heart.remove(), 2600);
      }, i * 70);
    }
  }


  // -----------------------------------------------------------------
  // 9. AMBIENT PARTICLES (Hearts, Stars & Shimmering Dust)
  // -----------------------------------------------------------------
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ambientCtx = ambientCanvas.getContext('2d');
  let ambientParticles = [];

  function resizeAmbientCanvas() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeAmbientCanvas);
  resizeAmbientCanvas();

  class AmbientParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * ambientCanvas.width;
      this.y = ambientCanvas.height + Math.random() * 100;
      this.size = Math.random() * 14 + 6;
      this.speedY = Math.random() * 0.9 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.type = Math.random() > 0.45 ? 'heart' : 'sparkle';
      this.color = ['#f472b6', '#fbcfe8', '#fcd34d', '#fda4af', '#f43f5e'][Math.floor(Math.random() * 5)];
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rot += this.rotSpeed;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, s / 4);
        ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
        ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, s / 4);
        ctx.fill();
      } else {
        // 4-point Sparkle Star
        const r = this.size / 2;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3));
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 40; i++) {
    const p = new AmbientParticle();
    p.y = Math.random() * ambientCanvas.height;
    ambientParticles.push(p);
  }

  function animateAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    for (const p of ambientParticles) {
      p.update();
      p.draw(ambientCtx);
    }
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // Interactive Cursor Sparkle Trail
  let lastSparkleTime = 0;
  window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime > 40) {
      lastSparkleTime = now;
      createCursorSparkle(e.clientX, e.clientY);
    }
  });

  function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = Math.random() > 0.5 ? '✨' : '💖';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x - 10}px`;
    sparkle.style.top = `${y - 10}px`;
    sparkle.style.fontSize = `${Math.random() * 12 + 10}px`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9998';
    sparkle.style.transition = 'all 0.8s ease-out';
    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(0.2)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 800);
  }


  // -----------------------------------------------------------------
  // 10. CONFETTI BURST SYSTEM (Rich Pastel Palette)
  // -----------------------------------------------------------------
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  class ConfettiPiece {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 14 + 5;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - 4;
      this.gravity = 0.28;
      this.drag = 0.95;
      this.colors = ['#f472b6', '#ec4899', '#fbcfe8', '#fed7aa', '#fcd34d', '#fda4af', '#ffffff'];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.size = Math.random() * 9 + 5;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.25;
      this.opacity = 1;
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
    }
    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.rotSpeed;
      this.opacity -= 0.012;
    }
    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function triggerConfettiExplosion(x, y, count = 100) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece(x, y));
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.update();
      p.draw(confettiCtx);
      if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
        confettiPieces.splice(i, 1);
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // Floating Balloons Click Interaction
  const interactiveBalloons = document.querySelectorAll('.balloon');
  interactiveBalloons.forEach(b => {
    b.addEventListener('click', (e) => {
      soundEffects.pop();
      const rect = b.getBoundingClientRect();
      triggerConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      b.style.transform = 'scale(1.3) rotate(15deg)';
      setTimeout(() => {
        b.style.transform = '';
      }, 300);
    });
  });

});
