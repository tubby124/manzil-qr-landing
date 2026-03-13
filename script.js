/* ============================================
   Manzil Realty Group — QR Landing Page JS
   vCard download + event tracking
   ============================================ */

// ---- CONFIG ----
const TRACKING_URL = 'https://script.google.com/macros/s/AKfycbwtMM5sdg29ugXOwfKOrweZWGJE17WmdjWe2DlkhVqOTLwyp4S5G1HBs_39opC5b0s/exec';

// ---- VENUE DETECTION ----
function getVenue() {
  const params = new URLSearchParams(window.location.search);
  return params.get('v') || 'direct';
}

// ---- AGENT DATA (used by personalizeHeader) ----
const CONTACTS = {
  hasan: { fn: 'Hasan Sharif' },
  omar: { fn: 'Omar Sharif' }
};

// ---- SAVE CONTACT (static .vcf files) ----
function saveContact(agent) {
  trackEvent('save_contact', agent);

  // Visual feedback
  var card = document.getElementById(agent + '-card');
  if (card) {
    var btn = card.querySelector('.btn-primary');
    if (btn) {
      var originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!';
      btn.classList.add('saved');
      setTimeout(function() {
        btn.innerHTML = originalHTML;
        btn.classList.remove('saved');
      }, 3000);
    }
  }

  // Navigate to static .vcf file — works on all mobile browsers and in-app browsers
  window.location.href = '/contacts/' + agent + '.vcf';
}

// ---- EVENT TRACKING ----
function trackEvent(action, agent, detail) {
  var venue = getVenue();
  var payload = {
    timestamp: new Date().toISOString(),
    venue: venue,
    action: action,
    agent: agent || '',
    detail: detail || '',
    userAgent: navigator.userAgent,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
  };

  // Send to Google Apps Script (non-blocking, fire-and-forget)
  if (TRACKING_URL) {
    fetch(TRACKING_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      mode: 'no-cors',
      keepalive: true
    }).catch(function() {});
  }
}

// ---- AGENT-SPECIFIC HEADER ----
function getAgent() {
  var params = new URLSearchParams(window.location.search);
  return params.get('a') || '';
}

function personalizeHeader() {
  var agent = getAgent();
  if (!agent || !CONTACTS[agent]) return;

  var c = CONTACTS[agent];
  var logoText = document.querySelector('.logo-text');
  if (logoText) {
    logoText.innerHTML = '<span class="logo-manzil">' + c.fn.toUpperCase() + '</span>' +
      '<span class="logo-divider">|</span>' +
      '<span class="logo-exp">eXp Realty &middot; Manzil Realty Group</span>';
  }
}

// ---- GOLDEN LANTERN BOKEH ----
(function() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  // Cap DPR at 2 — 3x mobile devices choke on shadowBlur at full res
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var particles = [];
  var frame = 0;
  var rafId = null;
  var running = false;

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle(startAtBottom) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var isGold = Math.random() < 0.7;
    var isStar = Math.random() < 0.15;
    var r = rand(3, 18);
    var opacity = rand(0.15, 0.45);
    return {
      x: rand(0, w),
      y: startAtBottom ? h + rand(10, 60) : rand(0, h),
      radius: r,
      opacity: opacity,
      color: isGold ? '201,169,110' : '14,154,167',
      speed: rand(0.15, 0.45),
      driftAmp: rand(0.2, 0.6),
      driftPeriod: rand(200, 500),
      driftOffset: rand(0, 1000),
      isStar: isStar,
      hasGlow: !isMobile && Math.random() < 0.4,
      glowSize: rand(8, 20)
    };
  }

  function init() {
    resize();
    var count = isMobile
      ? Math.min(25, Math.floor(20 * (window.innerWidth / 375)))
      : Math.min(50, Math.floor(30 * (window.innerWidth / 375)));
    if (count < 12) count = 12;
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle(false));
    }
  }

  function drawStar(cx, cy, outerR, innerR) {
    var points = 8;
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var r = i % 2 === 0 ? outerR : innerR;
      var angle = (Math.PI * i) / points - Math.PI / 2;
      var x = cx + r * Math.cos(angle);
      var y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function render() {
    if (!running) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      p.y -= p.speed;
      p.x += Math.sin((frame + p.driftOffset) / p.driftPeriod) * p.driftAmp;

      if (p.y < -p.radius * 2) {
        particles[i] = createParticle(true);
        continue;
      }

      ctx.save();

      if (p.hasGlow) {
        ctx.shadowColor = 'rgba(' + p.color + ',0.6)';
        ctx.shadowBlur = p.glowSize;
      }

      ctx.fillStyle = 'rgba(' + p.color + ',' + p.opacity + ')';

      if (p.isStar) {
        drawStar(p.x, p.y, p.radius, p.radius * 0.45);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    frame++;
    rafId = requestAnimationFrame(render);
  }

  function startLoop() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(render);
  }

  function stopLoop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // Init and start
  init();
  startLoop();

  // Safari pauses rAF on fixed canvases — restart on visibility change
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      startLoop();
    } else {
      stopLoop();
    }
  });

  // iOS Safari may throttle until user interaction — restart on first touch/scroll
  var wakeEvents = ['touchstart', 'scroll', 'click'];
  function wake() {
    if (!running) startLoop();
  }
  for (var i = 0; i < wakeEvents.length; i++) {
    window.addEventListener(wakeEvents[i], wake, { passive: true });
  }

  // Also restart with setInterval fallback — catches Safari edge cases
  setInterval(function() {
    if (document.visibilityState === 'visible' && !running) {
      startLoop();
    }
  }, 2000);

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      init();
      if (!running) startLoop();
    }, 150);
  });
})();

// ---- PAGE LOAD TRACKING ----
document.addEventListener('DOMContentLoaded', function() {
  personalizeHeader();
  trackEvent('page_scan', getAgent() || '', getVenue());
});
