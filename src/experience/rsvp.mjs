import { postInvitationApi } from './request.mjs';

export function mountReply(ctx) {
  const { root, $, on, signal } = ctx, demo = root.dataset.mode === 'demo';
  const verify = $('verify-form'), form = $('rsvp-form');
  let invitation = null, code = '', requestId = '', fingerprint = '', revision = 0;
  const description = e => e.name === 'AbortError' ? 'The request timed out. You can safely retry.' : e.message || 'Please try again.';
  function busy(f, value) {
    f.setAttribute('aria-busy', String(value));
    f.querySelectorAll('button,input,textarea,select').forEach(el => { el.disabled = value || !!(el.closest('#attending-fields') && $('attending-fields').hidden); });
  }
  async function api(path, body) {
    if (demo) {
      if (path === 'invitation') {
        if (body.code.trim().toUpperCase() !== 'DEMO2027') throw Error('That invitation code was not recognized.');
        return { maxGuests: 2, label: 'Preview guest', allowUpdates: true };
      }
      return { reference: 'PREVIEW-2027', demo: true };
    }
    return postInvitationApi(path, body, { signal });
  }
  function attendance() {
    const yes = form.querySelector('[name=attendance]:checked')?.value === 'yes';
    $('attending-fields').hidden = !yes;
    $('attending-fields').querySelectorAll('input,select,textarea').forEach(el => { el.disabled = !yes || form.getAttribute('aria-busy') === 'true'; });
    form.querySelectorAll('[name=travel]').forEach(el => { el.required = yes; });
  }
  function apply(found, sent) {
    if (!Number.isInteger(found?.maxGuests) || found.maxGuests < 1 || found.maxGuests > 20) throw Error('This invitation could not be loaded. Please contact the organizers.');
    invitation = found; code = sent; verify.hidden = true; form.hidden = false;
    $('step-label').textContent = 'YOUR REPLY'; $('step-count').textContent = '';
    $('guest-heading').textContent = found.label ? `Your reply, ${found.label}.` : 'Your reply.';
    $('guest-count').replaceChildren(...Array.from({ length: found.maxGuests }, (_, i) => new Option(String(i + 1), String(i + 1))));
    $('invitation-allowance').textContent = `Your invitation welcomes up to ${found.maxGuests} ${found.maxGuests === 1 ? 'guest' : 'guests'}, including you.`;
  }
  function clear() {
    revision++; invitation = null; code = ''; requestId = ''; fingerprint = '';
    form.reset(); verify.reset(); busy(form, false); busy(verify, false); attendance();
    form.hidden = true; verify.hidden = false; $('confirmation').hidden = true; $('reply-form-wrap').hidden = false;
    $('step-label').textContent = '01 / YOUR INVITATION'; $('step-count').textContent = '1 — 2';
    $('verify-status').textContent = ''; $('rsvp-status').textContent = '';
  }
  on(form, 'change', attendance); attendance();
  on(verify, 'submit', async e => {
    e.preventDefault(); if (verify.getAttribute('aria-busy') === 'true') return;
    const current = revision, sent = $('code').value.trim(); busy(verify, true); $('verify-status').textContent = 'Finding your invitation…';
    try { const found = await api('invitation', { code: sent }); if (current !== revision || signal.aborted) return; apply(found, sent); $('verify-status').textContent = ''; $('guest-name').focus(); }
    catch (e) { if (!signal.aborted) $('verify-status').textContent = description(e); }
    finally { busy(verify, false); }
  });
  on($('change-code'), 'click', () => { clear(); $('code').focus(); });
  on(form, 'submit', async e => {
    e.preventDefault(); if (!invitation || form.getAttribute('aria-busy') === 'true') return;
    const current = revision, data = new FormData(form), yes = data.get('attendance') === 'yes';
    const payload = { code, name: String(data.get('name') || '').trim(), attendance: yes ? 'yes' : 'no', guests: yes ? Number(data.get('guests')) : 0, dietary: yes ? String(data.get('dietary') || '').trim() : '', travel: yes ? data.get('travel') : null, message: String(data.get('message') || '').trim() };
    const next = JSON.stringify(payload);
    if (next !== fingerprint) { requestId = crypto.randomUUID(); fingerprint = next; }
    busy(form, true); $('rsvp-status').textContent = 'Sending your reply…';
    try {
      const result = await api('rsvp', { ...payload, requestId });
      if (current !== revision || signal.aborted) return;
      if (!result?.reference || (!demo && result.demo)) throw Error('Your reply could not be confirmed. You can safely retry.');
      $('reply-form-wrap').hidden = true; $('confirmation').hidden = false;
      $('confirmed-kicker').textContent = demo ? 'PREVIEW ONLY · NO RSVP SENT' : 'REPLY RECEIVED';
      $('confirmed-heading').textContent = yes ? 'We look forward to seeing you.' : 'Thank you for letting us know.';
      $('confirmed-message').textContent = demo ? 'This is a simulated confirmation. No guest information was sent or saved.' : yes ? 'Your attendance has been recorded. The organizers will share further details with confirmed guests.' : 'Your response has been recorded. Thank you for being part of our story.';
      $('confirmed-reference').textContent = `REFERENCE / ${result.reference}`; $('edit-rsvp').hidden = invitation.allowUpdates === false;
      $('confirmation').focus();
      if (ctx.moving()) ctx.animate($('confirmation').querySelector('.confirmed-seal'), [{ transform: 'scale(.82) rotate(-12deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], { duration: 640, fill: 'none' });
      $('rsvp-status').textContent = '';
    } catch (e) { if (!signal.aborted) $('rsvp-status').textContent = description(e); }
    finally { busy(form, false); attendance(); }
  });
  on($('edit-rsvp'), 'click', () => { $('confirmation').hidden = true; $('reply-form-wrap').hidden = false; $('guest-name').focus(); });
  return { api, apply, clear, busy, description };
}
