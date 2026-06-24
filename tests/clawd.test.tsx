import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import App from '../src/app.js';
import {mockFetch, lastContent} from './helpers.js';

test('clawd: logo shows when clawd=true (paws ▘▘ visible)', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App clawd />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('▘▘')).toBe(true);
  globalThis.fetch = orig;
});

test('clawd: logo hidden when clawd=false', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('▘▘')).toBe(false);
  globalThis.fetch = orig;
});

test('clawd: logo hidden when terminal too narrow', async () => {
  const orig = globalThis.fetch;
  const origColumns = process.stdout.columns;
  Object.defineProperty(process.stdout, 'columns', {value: 40, configurable: true, writable: true});
  mockFetch();
  const {frames} = render(<App clawd />);
  await new Promise(r => setTimeout(r, 500));
  expect(lastContent(frames).includes('▘▘')).toBe(false);
  Object.defineProperty(process.stdout, 'columns', {value: origColumns, configurable: true, writable: true});
  globalThis.fetch = orig;
});

test('clawd: normal variant shows █████ body when all operational', async () => {
  const orig = globalThis.fetch;
  mockFetch();
  const {frames} = render(<App clawd />);
  await new Promise(r => setTimeout(r, 500));
  const frame = lastContent(frames);
  expect(frame.includes('█████')).toBe(true);
  expect(frame.includes('▐███▌')).toBe(false);
  globalThis.fetch = orig;
});

test('clawd: crying variant shows ▐███▌ body on outage', async () => {
  const orig = globalThis.fetch;
  mockFetch([
    {id: '1', name: 'Claude Code', status: 'degraded_performance'},
    {id: '2', name: 'Claude API (api.anthropic.com)', status: 'operational'},
  ]);
  const {frames} = render(<App clawd />);
  await new Promise(r => setTimeout(r, 500));
  const frame = lastContent(frames);
  expect(frame.includes('▘▘')).toBe(true);
  expect(frame.includes('▐███▌')).toBe(true);
  expect(frame.includes('█████')).toBe(false);
  globalThis.fetch = orig;
});
