import React from 'react';
import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import App from './source/app.js';
import StatusRow from './source/statusRow.js';
import {darkTheme} from './source/theme.js';

const theme = darkTheme;
const comp = (name: string, status: string) => ({id: name, name, status});

// ── Flag expansion (mirrors cli.tsx logic) ──────────────────────────────────

function expandFlags(rawArgs: string[]): string[] {
  const args: string[] = [];
  for (const arg of rawArgs) {
    if (/^-[a-zA-Z]{2,}$/.test(arg)) {
      for (const ch of arg.slice(1)) args.push(`-${ch}`);
    } else {
      args.push(arg);
    }
  }
  return args;
}

test('flags: -as expands to -a and -s', () => {
  expect(expandFlags(['-as'])).toEqual(['-a', '-s']);
});

test('flags: -sa expands to -s and -a', () => {
  expect(expandFlags(['-sa'])).toEqual(['-s', '-a']);
});

test('flags: single short flags pass through unchanged', () => {
  expect(expandFlags(['-a', '-s'])).toEqual(['-a', '-s']);
});

test('flags: long flags pass through unchanged', () => {
  expect(expandFlags(['--all', '--silent'])).toEqual(['--all', '--silent']);
});

test('flags: mixed combined and long flags', () => {
  expect(expandFlags(['-as', '--help'])).toEqual(['-a', '-s', '--help']);
});

test('flags: triple combo -ash expands all three', () => {
  expect(expandFlags(['-ash'])).toEqual(['-a', '-s', '-h']);
});

// ── StatusRow: inline_full ──────────────────────────────────────────────────

test('inline: operational shows ✔ Operational', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'operational')}
      nameWidth={15}
      statusColWidth={13}
      theme={theme}
      all={false}
      layout="inline_full"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('✔')).toBe(true);
  expect(frame.includes('Operational')).toBe(true);
});

test('inline: major_outage shows ✘ Major outage', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude API', 'major_outage')}
      nameWidth={15}
      statusColWidth={14}
      theme={theme}
      all={false}
      layout="inline_full"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('✘')).toBe(true);
  expect(frame.includes('Major outage')).toBe(true);
});

test('inline: non-operational shows ✘ Partial outage', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'degraded_performance')}
      nameWidth={15}
      statusColWidth={16}
      theme={theme}
      all={false}
      layout="inline_full"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('✘')).toBe(true);
  expect(frame.includes('Partial outage')).toBe(true);
});

test('inline: strips suffix from name when all=false', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude API (api.anthropic.com)', 'operational')}
      nameWidth={15}
      statusColWidth={13}
      theme={theme}
      all={false}
      layout="inline_full"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('Claude API')).toBe(true);
  expect(frame.includes('(api.anthropic.com)')).toBe(false);
});

test('inline: keeps full name with suffix when all=true', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude API (api.anthropic.com)', 'operational')}
      nameWidth={35}
      statusColWidth={13}
      theme={theme}
      all={true}
      layout="inline_full"
    />,
  );
  expect(lastFrame()!.includes('Claude API (api.anthropic.com)')).toBe(true);
});

// ── StatusRow: stacked_full ─────────────────────────────────────────────────

test('stacked_full: shows └ and full status text', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'operational')}
      nameWidth={11}
      statusColWidth={13}
      theme={theme}
      all={false}
      layout="stacked_full"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('└')).toBe(true);
  expect(frame.includes('Operational')).toBe(true);
  expect(frame.includes('OK')).toBe(false);
});

test('stacked_full: major_outage shows full text not short', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'major_outage')}
      nameWidth={11}
      statusColWidth={14}
      theme={theme}
      all={false}
      layout="stacked_full"
    />,
  );
  expect(lastFrame()!.includes('Major outage')).toBe(true);
});

test('stacked_full: partial shows full text not short', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'degraded_performance')}
      nameWidth={11}
      statusColWidth={16}
      theme={theme}
      all={false}
      layout="stacked_full"
    />,
  );
  expect(lastFrame()!.includes('Partial outage')).toBe(true);
});

// ── StatusRow: stacked_short ────────────────────────────────────────────────

test('stacked_short: operational shows OK (all caps)', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'operational')}
      nameWidth={11}
      statusColWidth={13}
      theme={theme}
      all={false}
      layout="stacked_short"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('OK')).toBe(true);
  expect(frame.includes('Operational')).toBe(false);
});

test('stacked_short: major_outage shows Major not full text', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'major_outage')}
      nameWidth={11}
      statusColWidth={14}
      theme={theme}
      all={false}
      layout="stacked_short"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('Major')).toBe(true);
  expect(frame.includes('Major outage')).toBe(false);
});

test('stacked_short: non-operational shows Partial not full text', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'degraded_performance')}
      nameWidth={11}
      statusColWidth={16}
      theme={theme}
      all={false}
      layout="stacked_short"
    />,
  );
  const frame = lastFrame()!;
  expect(frame.includes('Partial')).toBe(true);
  expect(frame.includes('Partial outage')).toBe(false);
});

test('stacked_short: └ still shown', () => {
  const {lastFrame} = render(
    <StatusRow
      comp={comp('Claude Code', 'operational')}
      nameWidth={11}
      statusColWidth={13}
      theme={theme}
      all={false}
      layout="stacked_short"
    />,
  );
  expect(lastFrame()!.includes('└')).toBe(true);
});

// ink v7 writes an empty frame on exit, so lastFrame() is blank after done.
// Use the last non-empty frame captured in frames[] instead.
const lastContent = (frames: string[]) =>
  [...frames].reverse().find(f => (f?.trim().length ?? 0) > 1) ?? '';

// ── App: loading & error states ─────────────────────────────────────────────

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

// ── App: data rendering ─────────────────────────────────────────────────────

const mockComponents = [
  {id: '1', name: 'Claude Code', status: 'operational'},
  {id: '2', name: 'Claude API (api.anthropic.com)', status: 'operational'},
  {id: '3', name: 'claude.ai', status: 'operational'},
];

function mockFetch(components = mockComponents) {
  globalThis.fetch = (async () => ({
    json: async () => ({components}),
  })) as any;
}

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
