import {test, expect} from 'vitest';

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
