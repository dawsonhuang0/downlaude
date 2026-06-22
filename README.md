# downlaude

<img src="demo.png" width="400" />

> CLI to check Claude's service status from your terminal

## Install

```bash
npm install --global downlaude
```

## Usage

```bash
downlaude          # show Claude API + Claude Code status
downlaude --all    # show all Claude services
downlaude --silent # no output; use exit code in scripts
```

## Options

| Flag | Description |
|------|-------------|
| `--all`<br>`-a` | Show all Claude services (claude.ai, Claude Console, Claude API, Claude Code, Claude Cowork, Claude for Government) |
| `--silent`<br>`-s` | No output. Exit `0` if operational, `1` if outage, `2` if unreachable |
| `--help`<br>`-h` | Show help |

## Exit codes (--silent)

| Code | Meaning |
|------|---------|
| `0` | All operational |
| `1` | At least one outage |
| `2` | Could not reach status page |

By default `--silent` checks Claude API and Claude Code only. Combine with `--all` to check all services:

```bash
downlaude -s    # checks Claude API + Claude Code
downlaude -s -a # checks all six services
```

## Scripting

```bash
downlaude --silent || echo "Claude is having issues"
downlaude --silent --all && deploy.sh
```
