/* ============================================
   Manzil Realty Group — QR Landing Page JS
   vCard download + event tracking
   ============================================ */

// ---- CONFIG ----
const N8N_WEBHOOK_URL = 'https://n8n.srv728397.hstgr.cloud/webhook/manzil-qr';

// ---- VENUE DETECTION ----
function getVenue() {
  const params = new URLSearchParams(window.location.search);
  return params.get('v') || 'direct';
}

// ---- VCARD GENERATION & DOWNLOAD ----
const CONTACTS = {
  hasan: {
    fn: 'Hasan Sharif',
    org: 'eXp Realty - Manzil Realty Group',
    title: 'Real Estate Sales Representative',
    tel: '+13068507687',
    email: 'hasan.sharif@exprealty.com',
    url: 'https://redleafhomes.ca',
    note: 'Halal Homeownership - Saskatchewan & Alberta | @nasahctus'
  },
  omar: {
    fn: 'Omar Sharif',
    org: 'eXp Realty - Manzil Realty Group',
    title: 'Provincial Team Lead',
    tel: '+13067163556',
    email: 'omarsha@gmail.com',
    url: 'https://omarsharif.exprealty.com',
    note: 'Halal Homeownership - Saskatchewan & Alberta | @skrealtor_omar'
  }
};

function generateVCard(agent) {
  const c = CONTACTS[agent];
  if (!c) return null;

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + c.fn,
    'ORG:' + c.org,
    'TITLE:' + c.title,
    'TEL;TYPE=CELL:' + c.tel,
    'EMAIL:' + c.email,
    'URL:' + c.url,
    'NOTE:' + c.note,
    'END:VCARD'
  ].join('\r\n');
}

function saveContact(agent) {
  const vcard = generateVCard(agent);
  if (!vcard) return;

  // Track the event
  trackEvent('save_contact', agent);

  // Create and trigger download
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = CONTACTS[agent].fn.replace(' ', '_') + '.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Visual feedback
  const card = document.getElementById(agent + '-card');
  if (card) {
    const btn = card.querySelector('.btn-primary');
    if (btn) {
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!';
      btn.classList.add('saved');
      setTimeout(function() {
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> Save Contact';
        btn.classList.remove('saved');
      }, 3000);
    }
  }
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

  // Send to n8n webhook (non-blocking, fire-and-forget)
  if (N8N_WEBHOOK_URL) {
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
      keepalive: true
    }).catch(function() {
      // Silent fail — tracking should never block UX
    });
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
  var isMobile = /Mobi|Android/i.test(navigator.userAgent);
  var particles = [];
  var frame = 0;

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
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
    // Fewer particles on mobile for performance
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
    requestAnimationFrame(render);
  }

  init();
  render();

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      init();
    }, 150);
  });
})();

// ---- PAGE LOAD TRACKING ----
document.addEventListener('DOMContentLoaded', function() {
  personalizeHeader();
  trackEvent('page_scan', getAgent() || '', getVenue());
});
