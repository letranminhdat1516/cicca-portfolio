import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ContactController, clientIp } from './contact.controller';
import { ContactService, DEFAULT_FROM, RESEND_URL } from './contact.service';
import { escapeHtml, firstName } from './contact.mail';
import { RateLimiter } from './rate-limiter';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to build an analytical engine.',
};

type FetchCall = [string, RequestInit];
const okResponse = () =>
  ({ ok: true, status: 200, text: async () => '{"id":"x"}' }) as Response;
const failResponse = (status = 500) =>
  ({ ok: false, status, text: async () => 'boom' }) as Response;

function sentBodies(fetchMock: jest.Mock) {
  return (fetchMock.mock.calls as FetchCall[]).map(([, init]) =>
    JSON.parse(init.body as string),
  );
}

describe('contact', () => {
  let app: INestApplication;
  let service: ContactService;
  let fetchMock: jest.Mock;
  const env = { ...process.env };

  beforeEach(async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    delete process.env.CONTACT_FROM;
    delete process.env.CONTACT_TO;
    fetchMock = jest.fn().mockImplementation(async () => okResponse());
    global.fetch = fetchMock as unknown as typeof fetch;

    const mod = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [ContactService],
    }).compile();
    app = mod.createNestApplication({ logger: false });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    service = app.get(ContactService);
  });

  afterEach(async () => {
    await app.close();
    process.env = { ...env };
  });

  const post = (body: object, headers: Record<string, string> = {}) => {
    const r = request(app.getHttpServer()).post('/contact');
    for (const [k, v] of Object.entries(headers)) r.set(k, v);
    return r.send(body);
  };

  it('sends the notification and the auto-reply with the right fields', async () => {
    const res = await post(valid, {
      'cf-connecting-ip': '1.2.3.4',
      referer: 'https://letranminhdat.com/',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [url, init] = fetchMock.mock.calls[0] as FetchCall;
    expect(url).toBe(RESEND_URL);
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer re_test_key',
    );

    const [note, reply] = sentBodies(fetchMock);
    expect(note.from).toBe(DEFAULT_FROM);
    expect(note.to).toEqual(['datltmse@gmail.com']);
    expect(note.reply_to).toBe('ada@example.com');
    expect(note.subject).toBe('New letter from Ada Lovelace');
    for (const part of [note.text, note.html]) {
      expect(part).toContain('Ada Lovelace');
      expect(part).toContain('ada@example.com');
      expect(part).toContain('analytical engine');
      expect(part).toContain('https://letranminhdat.com/');
      expect(part).toContain('GMT+7');
    }

    expect(reply.from).toBe(DEFAULT_FROM);
    expect(reply.to).toEqual(['ada@example.com']);
    expect(reply.subject).toBe('Thanks for your letter');
    // nothing the visitor typed is echoed into a mail sent to a visitor-typed address
    for (const part of [reply.subject, reply.text, reply.html])
      expect(part).not.toContain('Ada');
    for (const part of [reply.text, reply.html]) {
      expect(part).toContain(
        'https://letranminhdat.com/cv/letranminhdat-cv.pdf',
      );
      expect(part).toContain('https://letranminhdat.com/#work');
      expect(part).toContain('Dat (cicca)');
      expect(part).toContain('1–2 days');
      // Never echo the visitor's free text back to a visitor-supplied address.
      expect(part).not.toContain('analytical engine');
    }
  });

  it('honours CONTACT_FROM / CONTACT_TO', async () => {
    process.env.CONTACT_FROM = 'Dat <mail@example.org>';
    process.env.CONTACT_TO = 'me@example.org';
    await post(valid).expect(200);
    const [note, reply] = sentBodies(fetchMock);
    expect(note.from).toBe('Dat <mail@example.org>');
    expect(note.to).toEqual(['me@example.org']);
    expect(reply.from).toBe('Dat <mail@example.org>');
  });

  it('trims input before sending', async () => {
    await post({
      ...valid,
      name: '  Ada  ',
      email: ' ada@example.com ',
    }).expect(200);
    const [note] = sentBodies(fetchMock);
    expect(note.subject).toBe('New letter from Ada');
    expect(note.reply_to).toBe('ada@example.com');
  });

  it('escapes HTML in every user-supplied value', async () => {
    await post({
      name: '<b>Eve</b> "x"',
      email: 'eve@example.com',
      message: '<script>alert(1)</script> & <img src=x onerror=alert(2)>',
    }).expect(200);
    const [note, reply] = sentBodies(fetchMock);
    expect(note.html).not.toContain('<script>');
    expect(note.html).not.toContain('<img src=x');
    expect(note.html).not.toContain('<b>Eve</b>');
    expect(note.html).toContain(
      '&lt;script&gt;alert(1)&lt;/script&gt; &amp; &lt;img',
    );
    expect(note.html).toContain('&lt;b&gt;Eve&lt;/b&gt; &quot;x&quot;');
    expect(reply.html).not.toContain('Eve');
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('honeypot: returns ok and sends nothing', async () => {
    const res = await post({ ...valid, website: 'http://spam.example' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['missing name', { ...valid, name: undefined }],
    ['blank name', { ...valid, name: '   ' }],
    ['name too long', { ...valid, name: 'a'.repeat(81) }],
    ['name with CRLF', { ...valid, name: 'Ada\r\nBcc: x@y.z' }],
    ['bad email', { ...valid, email: 'not-an-email' }],
    ['email too long', { ...valid, email: `${'a'.repeat(115)}@x.com` }],
    ['email with newline', { ...valid, email: 'ada@example.com\nBcc: x@y.z' }],
    ['message too short', { ...valid, message: 'hi there' }],
    ['message too long', { ...valid, message: 'a'.repeat(3001) }],
    ['message padded short', { ...valid, message: '   short   ' }],
  ])('rejects %s with 400', async (_label, body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts boundary lengths', async () => {
    await post({
      ...valid,
      name: 'a'.repeat(80),
      message: 'a'.repeat(3000),
    }).expect(200);
    await post({ ...valid, message: 'a'.repeat(10) }).expect(200);
  });

  it('rate limits per client IP: 3 per 10 minutes → 429 with Retry-After', async () => {
    const ip = { 'cf-connecting-ip': '9.9.9.9' };
    for (let i = 0; i < 3; i++) await post(valid, ip).expect(200);
    const res = await post(valid, ip);
    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({ ok: false, error: 'rate_limited' });
    expect(Number(res.headers['retry-after'])).toBeGreaterThan(0);
    // another visitor is unaffected
    await post(valid, { 'cf-connecting-ip': '8.8.8.8' }).expect(200);
    // 4 notifications + 1 auto-reply: the same address gets at most one auto-reply a day
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('ignores x-forwarded-for (client-controlled) and falls back to the socket address', async () => {
    for (let i = 0; i < 3; i++) {
      await post(valid, { 'x-forwarded-for': `7.7.7.7, 10.0.0.${i}` }).expect(
        200,
      );
    }
    await post(valid, { 'x-forwarded-for': '7.7.7.7' }).expect(429);
  });

  it('caps sends globally, whatever IP the requests claim', async () => {
    for (let i = 0; i < 60; i++) {
      await post(
        { ...valid, email: `v${i}@example.com` },
        { 'cf-connecting-ip': `10.1.${Math.floor(i / 3)}.${i % 3}` },
      ).expect(200);
    }
    const res = await post(
      { ...valid, email: 'late@example.com' },
      { 'cf-connecting-ip': '10.9.9.9' },
    );
    expect(res.status).toBe(429);
    // 60 notifications + 30 auto-replies (global auto-reply cap)
    expect(fetchMock).toHaveBeenCalledTimes(90);
  });

  it('missing RESEND_API_KEY → 503 mail_not_configured', async () => {
    delete process.env.RESEND_API_KEY;
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ ok: false, error: 'mail_not_configured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('notification failure → 502 and no auto-reply', async () => {
    fetchMock.mockImplementationOnce(async () => failResponse(422));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect(res.body).toEqual({ ok: false, error: 'send_failed' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('network error on notification → 502', async () => {
    fetchMock.mockImplementationOnce(async () => {
      throw new TypeError('fetch failed');
    });
    await post(valid).expect(502);
  });

  it('auto-reply failure still returns 200', async () => {
    fetchMock
      .mockImplementationOnce(async () => okResponse())
      .mockImplementationOnce(async () => failResponse(500));
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('service is reachable for direct use', () => {
    expect(service).toBeInstanceOf(ContactService);
  });
});

describe('helpers', () => {
  it('firstName takes the first word, capped', () => {
    expect(firstName('  Ada   Lovelace ')).toBe('Ada');
    expect(firstName('x'.repeat(60))).toHaveLength(40);
  });

  it('clientIp prefers cf-connecting-ip, then x-forwarded-for, then socket', () => {
    const req = (headers: Record<string, string>) =>
      ({ headers, socket: { remoteAddress: '127.0.0.1' } }) as never;
    expect(
      clientIp(
        req({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' }),
      ),
    ).toBe('1.1.1.1');
    expect(clientIp(req({ 'x-forwarded-for': '2.2.2.2, 3.3.3.3' }))).toBe(
      '127.0.0.1',
    );
    expect(clientIp(req({}))).toBe('127.0.0.1');
  });
});

describe('RateLimiter', () => {
  it('enforces both the short and the daily window', () => {
    let t = 0;
    const rl = new RateLimiter(
      [
        { ms: 10 * 60_000, max: 3 },
        { ms: 24 * 60 * 60_000, max: 10 },
      ],
      () => t,
    );
    let accepted = 0;
    // one attempt every 4 minutes for a day
    for (; t < 24 * 60 * 60_000; t += 4 * 60_000)
      if (rl.take('a').ok) accepted++;
    expect(accepted).toBe(10);

    t = 0;
    const burst = new RateLimiter([{ ms: 600_000, max: 3 }], () => t);
    expect([1, 2, 3, 4].map(() => burst.take('b').ok)).toEqual([
      true,
      true,
      true,
      false,
    ]);
    const denied = burst.take('b');
    expect(denied.ok).toBe(false);
    if (denied.ok === false) expect(denied.retryAfterSec).toBe(600);
    t = 600_000;
    expect(burst.take('b').ok).toBe(true);
  });
});
