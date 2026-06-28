/* Vanta Birds (r134) for Hero background only */
/*
  Expects:
  - THREE loaded as window.THREE (from three.r134.min.js)
  - VANTA.BIRDS factory available as window.VANTA.BIRDS (from vanta.birds.min.js)
*/

(function () {
    function initVanta() {
        const el = document.getElementById('hero');
        if (!el || !window.VANTA || !window.VANTA.BIRDS) return;

        // Avoid double-init
        if (el.dataset.vantaInited === 'true') return;
        el.dataset.vantaInited = 'true';

        // Tuned for a minimalist, dark, and aesthetic theme
        window.__vantaHero = window.VANTA.BIRDS({
            el: '#hero-vanta', // Target the dedicated div
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0,
            color1: 0xbbbbbb, // Light grey for a subtle, elegant look
            color2: 0x888888, // Darker grey for depth
            birdSize: 1.2,
            wingSpan: 25.0,
            separation: 30.0,
            alignment: 30.0,
            cohesion: 30.0,
            quantity: 3.0,
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVanta, { once: true });
    } else {
        initVanta();
    }
})();
