#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(`
	Usage
	  $ downlaude

	Options
	  -a, --all  Show all Claude services

	Examples
	  $ downlaude
	  $ downlaude --all
`, {
	importMeta: import.meta,
	flags: {
		all: {
			type: 'boolean',
			alias: 'a',
		},
	},
});

const known = new Set(['all', 'a']);
const unknown = Object.keys(cli.unnormalizedFlags).filter(f => f !== '_' && !known.has(f));
if (unknown.length > 0) {
	cli.showHelp(2);
}

render(<App all={cli.flags.all} />).waitUntilExit().then(() => {
	process.exit(0);
});
