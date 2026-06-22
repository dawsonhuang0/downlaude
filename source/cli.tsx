#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App, { ALL_COMPONENTS } from './app.js';

const cli = meow(`
	Usage
	  $ downlaude

	Options
	  -a, --all     Show all Claude services
	  -s, --silent  No output; exit 0 if operational, 1 if outage, 2 if unreachable

	Examples
	  $ downlaude
	  $ downlaude --all
	  $ downlaude --silent && echo "all good"
`, {
	importMeta: import.meta,
	flags: {
		all: {
			type: 'boolean',
			alias: 'a',
		},
		silent: {
			type: 'boolean',
			alias: 's',
		},
	},
});

const known = new Set(['all', 'a', 'silent', 's']);
const unknown = Object.keys(cli.unnormalizedFlags).filter(f => f !== '_' && !known.has(f));
if (unknown.length > 0) {
	cli.showHelp(2);
}

if (cli.flags.silent) {
	(async () => {
		try {
			const res = await fetch('https://status.anthropic.com/api/v2/components.json');
			const data = await res.json() as { components: Array<{ name: string; status: string }> };
			const target = data.components.filter((c) =>
				cli.flags.all
					? ALL_COMPONENTS.some(n => c.name.includes(n))
					: c.name.includes('Claude API') || c.name.includes('Claude Code')
			);
			const hasOutage = target.some(c => c.status !== 'operational');
			process.exit(hasOutage ? 1 : 0);
		} catch {
			process.exit(2);
		}
	})();
} else {
	render(<App all={cli.flags.all} />).waitUntilExit().then(() => {
		process.exit(0);
	});
}
