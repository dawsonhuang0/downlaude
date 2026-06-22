# downlaude

CLI to check Claude's service status from your terminal.  
<img src="https://raw.githubusercontent.com/dawsonhuang0/downlaude/main/demo.png" width="400" />

## Getting Started

Run the following command to install:

```bash
npm install --global downlaude
```

## Usage

```bash
downlaude           # show Claude API + Claude Code status
downlaude [options] # customize the output to what you need
```

### Options:

| Flag & Alias        | Description                            |
| ------------------- | -------------------------------------- |
| `-a`,<br>`--all`    | Show all Claude services               |
| `-s`,<br>`--silent` | No output. Exits with `0`, `1`, or `2` |
| `-h`,<br>`--help`   | Show help                              |

For example, with `--all` flag:  
<img src="https://raw.githubusercontent.com/dawsonhuang0/downlaude/main/demo-all.png" width="443" />

## Scripting Friendliness

#### No output hassle 😍 perfectly silent so you can just catch the exit code!

| Exit Code | Meaning                     |
| --------- | --------------------------- |
| `0`       | All operational             |
| `1`       | At least one outage         |
| `2`       | Could not reach status page |

### ⚠️ Scope of the Exit Code

By default, `--silent` checks Claude API and Claude Code only:

```bash
downlaude --silent # checks Claude API + Claude Code
```

Combine with `--all` to check all services:

```bash
downlaude -s -a # checks all services
downlaude -sa   # you can use short flags!
```

### Scripting Examples

```bash
downlaude --silent || echo "Claude is down"
downlaude --silent --all && deploy.sh
```

## Feedback

**Found a bug?** Feel free to [open an issue](https://github.com/dawsonhuang0/downlaude/issues/new?labels=bug).  
**New option/feature idea?** Don't hesitate to [share it with us](https://github.com/dawsonhuang0/downlaude/issues/new?labels=enhancement).

## Acknowledgments

- **[Ink](https://github.com/vadimdemedes/ink)** - For the terminal React UI framework.
- **[React](https://reactjs.org/)** - For the component-driven foundation.
- **[Anthropic](https://www.anthropic.com/)** - For the Status API powering this tool.
- **[Claude Code](https://github.com/anthropics/claude-code)** - For inspiring the UX and theme detection design.

## License

Distributed under the MIT License.  
See [`LICENSE`](LICENSE) for more information.
