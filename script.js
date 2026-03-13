/* ============================================
   Manzil Realty Group — QR Landing Page JS
   vCard download + event tracking
   ============================================ */

// ---- CONFIG ----
const N8N_WEBHOOK_URL = 'https://n8n.srv728397.hstgr.cloud/webhook/manzil-qr-event';

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
    title: 'Real Estate Sales Representative',
    tel: '+13067163556',
    email: 'omarsha@gmail.com',
    url: 'https://manzil.ca',
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function() {
      // Silent fail — tracking should never block UX
    });
  }
}

// ---- PAGE LOAD TRACKING ----
document.addEventListener('DOMContentLoaded', function() {
  trackEvent('page_scan', '', getVenue());
});
