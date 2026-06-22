#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App, {ALL_COMPONENTS} from './app.js';

const USAGE = `
Usage
  $ downlaude

Options
  -a, --all     Show all Claude services
  -s, --silent  No output; exit 0 if operational, 1 if outage, 2 if unreachable

Examples
  $ downlaude
  $ downlaude --all
  $ downlaude --silent && echo "all good"
`;

// Expand combined short flags: -as → -a -s
const args: string[] = [];
for (const arg of process.argv.slice(2)) {
  if (/^-[a-zA-Z]{2,}$/.test(arg)) {
    for (const ch of arg.slice(1)) args.push(`-${ch}`);
  } else {
    args.push(arg);
  }
}

const known = new Set(['-a', '--all', '-s', '--silent', '-h', '--help']);
const unknown = args.filter(a => a.startsWith('-') && !known.has(a));

if (unknown.length > 0) {
  process.stderr.write(USAGE);
  process.exit(2);
}

if (args.includes('-h') || args.includes('--help')) {
  process.stdout.write(USAGE);
  process.exit(0);
}

const all = args.includes('-a') || args.includes('--all');
const silent = args.includes('-s') || args.includes('--silent');

if (silent) {
  (async () => {
    try {
      const res = await fetch(
        'https://status.anthropic.com/api/v2/components.json',
      );
      const data = (await res.json()) as {
        components: Array<{name: string; status: string}>;
      };
      const target = data.components.filter(c =>
        all
          ? ALL_COMPONENTS.some(n => c.name.includes(n))
          : c.name.includes('Claude API') || c.name.includes('Claude Code'),
      );
      const hasOutage = target.some(c => c.status !== 'operational');
      process.exit(hasOutage ? 1 : 0);
    } catch {
      process.exit(2);
    }
  })();
} else {
  render(<App all={all} />)
    .waitUntilExit()
    .then(() => {
      process.exit(0);
    });
}
