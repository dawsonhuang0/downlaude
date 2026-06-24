import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import StatusRow from '../src/statusRow.js';
import {darkTheme} from '../src/theme.js';

const theme = darkTheme;
const comp = (name: string, status: string) => ({id: name, name, status});

// ── inline_full ─────────────────────────────────────────────────────────────

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

// ── stacked_full ─────────────────────────────────────────────────────────────

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

// ── stacked_short ────────────────────────────────────────────────────────────

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
