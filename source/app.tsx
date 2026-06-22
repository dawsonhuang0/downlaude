import React, {useState, useEffect} from 'react';
import {Text, Box, useApp} from 'ink';
import StatusRow from './statusRow.js';
import Spinner from './spinner.js';
import {darkTheme, detectTheme, Theme} from './theme.js';

export const ALL_COMPONENTS = [
  'claude.ai',
  'Claude Console',
  'Claude API',
  'Claude Code',
  'Claude Cowork',
  'Claude for Government',
];

const stripSuffix = (name: string) => name.replace(/\s*\([^)]+\)$/, '');

export default function App({all = false}: {all?: boolean}) {
  const {exit} = useApp();
  const [theme, setTheme] = useState<Theme>(darkTheme);
  const [components, setComponents] = useState<any[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [terminalWidth, setTerminalWidth] = useState(
    process.stdout.columns ?? 80,
  );

  useEffect(() => {
    const onResize = () => setTerminalWidth(process.stdout.columns ?? 80);
    process.stdout.on('resize', onResize);
    return () => {
      process.stdout.off('resize', onResize);
    };
  }, []);

  useEffect(() => {
    async function init() {
      const detected = await detectTheme();
      setTheme(detected);

      try {
        const res = await fetch(
          'https://status.anthropic.com/api/v2/components.json',
        );
        const data = await res.json();
        const target = data.components
          .filter((c: any) =>
            all
              ? ALL_COMPONENTS.some(n => c.name.includes(n))
              : c.name.includes('Claude API') || c.name.includes('Claude Code'),
          )
          .sort((a: any, b: any) => {
            if (all) {
              const ai = ALL_COMPONENTS.findIndex(n => a.name.includes(n));
              const bi = ALL_COMPONENTS.findIndex(n => b.name.includes(n));
              return ai - bi;
            }
            return a.name.includes('Claude Code')
              ? -1
              : b.name.includes('Claude Code')
              ? 1
              : 0;
          });

        setComponents(target);
      } catch (err) {
        setError(true);
      }
      setDone(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (done) exit();
  }, [done, exit]);

  if (!done) return <Spinner text="Fetching status..." theme={theme} />;
  if (error)
    return (
      <Box
        flexDirection="column"
        paddingLeft={1}
        paddingRight={1}
        paddingTop={1}
        borderStyle="round"
        borderColor={theme.major}
        width={54}
      >
        <Text bold>
          <Text color={theme.accent}>✻</Text>
          <Text color={theme.text}> Claude Status</Text>
        </Text>
        <Box marginTop={1}>
          <Text color={theme.major}>✘ Could not reach status page</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={theme.muted}>
            Visit https://status.claude.com/ for latest status
          </Text>
        </Box>
      </Box>
    );
  if (components.length === 0) return <Text> </Text>;

  const displayName = (name: string) => (all ? name : stripSuffix(name));
  const STACKED_PRE = 3; // "⎿  "
  const FOOTER_LEN = 'Visit https://status.claude.com/ for latest status'
    .length;
  const BP = 4;
  const longestName = Math.max(
    ...components.map(c => displayName(c.name).length),
  );
  const statusColWidth = Math.max(
    ...components.map((c: any) =>
      c.status === 'major_outage' ? 14 : c.status !== 'operational' ? 16 : 13,
    ),
  );

  // Max box width = widest unwrapped line (footer or content row at max gaps)
  const maxBoxWidth =
    BP + Math.max(FOOTER_LEN, longestName + statusColWidth + 7);
  const boxWidth = Math.min(terminalWidth, maxBoxWidth);

  const phase1Min = BP + longestName + statusColWidth + 1;
  const phase2Min = BP + STACKED_PRE + statusColWidth;

  const layout: 'inline_full' | 'stacked_full' | 'stacked_short' =
    terminalWidth >= phase1Min
      ? 'inline_full'
      : terminalWidth >= phase2Min
      ? 'stacked_full'
      : 'stacked_short';

  const extra =
    layout === 'inline_full'
      ? Math.min(
          Math.max(boxWidth - BP - longestName - statusColWidth - 1, 0),
          6,
        )
      : 0;
  const gapLeft = 1 + Math.floor(extra / 2);
  const nameWidth =
    layout === 'inline_full' ? longestName + gapLeft : longestName;

  return (
    <Box
      flexDirection="column"
      paddingLeft={1}
      paddingRight={1}
      paddingTop={1}
      borderStyle="round"
      borderColor={theme.muted}
      width={boxWidth}
    >
      <Text bold>
        <Text color={theme.accent}>✻</Text>
        <Text color={theme.text}> Claude Status</Text>
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {components.map(comp => (
          <StatusRow
            key={comp.id}
            comp={comp}
            nameWidth={nameWidth}
            statusColWidth={statusColWidth}
            theme={theme}
            all={all}
            layout={layout}
          />
        ))}
      </Box>
      <Box marginTop={1}>
        <Text color={theme.muted}>
          Visit https://status.claude.com/ for latest status
        </Text>
      </Box>
    </Box>
  );
}
