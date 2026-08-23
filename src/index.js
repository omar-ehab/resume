const TO = 'omar.ehab510@gmail.com';
const FROM = 'Portfolio <onboarding@resend.dev>';

const LIMITS = { name: 120, email: 200, subject: 200, message: 5000 };

function field(form, key) {
  return (form.get(key) || '').toString().trim().slice(0, LIMITS[key]);
}

function fail(status, detail) {
  const body = `<!doctype html><meta charset="utf-8"><title>Message not sent</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<style>body{font:16px/1.6 system-ui,sans-serif;background:#0b0d10;color:#e6e8ec;margin:0;display:grid;place-items:center;min-height:100vh;padding:1.5rem}
main{max-width:32rem}a{color:#818cf8}</style>
<main><h1>Message not sent</h1>
<p>Something went wrong on my end and your message did not reach me. ${detail}</p>
<p>Please email me directly at <a href="mailto:${TO}">${TO}</a>, or <a href="/#contact">go back and try again</a>.</p></main>`;
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function handleContact(request, env) {
  const thanks = () => Response.redirect(new URL('/?thanks=true', request.url), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return fail(400, 'The form data could not be read.');
  }

  if (form.get('bot-field')) return thanks();

  const name = field(form, 'name');
  const email = field(form, 'email');
  const subject = field(form, 'subject');
  const message = field(form, 'message');

  if (!name || !email || !message) return fail(400, 'Some required fields were empty.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, 'That email address looks invalid.');

  if (!env.RESEND_API_KEY) return fail(500, 'The mail service is not configured.');

  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio: ${subject || 'New message'} (${name})`,
        text: `From: ${name} <${email}>\nSubject: ${subject || '(none)'}\n\n${message}`
      })
    });
  } catch {
    return fail(502, 'The mail service could not be reached.');
  }

  if (!res.ok) return fail(502, 'The mail service rejected the message.');

  return thanks();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/contact') {
      if (request.method === 'POST') return handleContact(request, env);
      return new Response(null, { status: 303, headers: { Location: '/#contact' } });
    }

    return env.ASSETS.fetch(request);
  }
};
