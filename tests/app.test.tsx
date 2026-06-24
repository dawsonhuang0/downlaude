import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import App from '../src/app.js';
import {mockFetch, lastContent} from './helpers.js';

// ── loading & error states ───────────────────────────────────────────────────

test('App shows spinner before data loads', () => {
  const orig = globalThis.fetch;
  globalThis.fetch = (() => new Promise(() => {})) as any;
  const {lastFrame} = render(<App />);
  expect(lastFrame()!.includes('Fetching status')).toBe(true);
  globalThis.fetch = orig;
});

test('App shows error when fetch throws', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = (async () => {
    throw new Error('network');
  }) as any;
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('Could not reach')).toBe(true);
  globalThis.fetch = orig;
});

test('App shows error when json parse fails', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = (async () => ({
    json: async () => {
      throw new Error('bad json');
    },
  })) as any;
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('Could not reach')).toBe(true);
  globalThis.fetch = orig;
});

// ── data rendering ───────────────────────────────────────────────────────────

test('App default: renders Claude Code and Claude API', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  const frame = lastContent(frames);
  expect(frame.includes('Claude Code')).toBe(true);
  expect(frame.includes('Claude API')).toBe(true);
  globalThis.fetch = orig;
});

test('App default: excludes non-API/Code services', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('claude.ai')).toBe(false);
  globalThis.fetch = orig;
});

test('App default: Claude Code appears before Claude API', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  const frame = lastContent(frames);
  expect(frame.indexOf('Claude Code') < frame.indexOf('Claude API')).toBe(true);
  globalThis.fetch = orig;
});

test('App --all: includes claude.ai', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App all />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('claude.ai')).toBe(true);
  globalThis.fetch = orig;
});

test('App --all: shows full name with suffix', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App all />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('Claude API (api.anthropic.com)')).toBe(true);
  globalThis.fetch = orig;
});

test('App: shows footer URL', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('status.claude.com')).toBe(true);
  globalThis.fetch = orig;
});
