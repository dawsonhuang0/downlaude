import React, { useState, useEffect } from 'react';
import { Text, Box, useApp } from 'ink';
import StatusRow from './statusRow.js';
import Spinner from './spinner.js';
import { darkTheme, detectTheme, Theme } from './theme.js';

export default function App() {
  const { exit } = useApp();
  const [theme, setTheme] = useState<Theme>(darkTheme);
  const [components, setComponents] = useState<any[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function init() {
      const detected = await detectTheme();
      setTheme(detected);

      try {
        const res = await fetch('https://status.anthropic.com/api/v2/components.json');
        const data = await res.json();
        const target = data.components.filter((c: any) =>
          c.name.includes('Claude API') || c.name.includes('Claude Code')
        ).sort((a: any, b: any) => a.name.includes('Claude Code') ? -1 : b.name.includes('Claude Code') ? 1 : 0);

        const dummies = [
          { id: 'dummy-partial', name: 'Claude API (Dummy Partial)', status: 'partial_outage' },
          { id: 'dummy-major', name: 'Claude API (Dummy Major)', status: 'major_outage' },
        ];
        setComponents([...target, ...dummies]);
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
  if (error) return (
    <Box flexDirection="column" paddingLeft={1} paddingRight={1} paddingTop={1} borderStyle="round" borderColor={theme.major} width={54}>
      <Text bold>
        <Text color={theme.accent}>✻</Text>
        <Text color={theme.text}> Claude Status</Text>
      </Text>
      <Box marginTop={1}>
        <Text color={theme.major}>✘ Could not reach status page</Text>
      </Box>
      <Box marginTop={1}>
        <Text color={theme.muted}>Visit https://status.claude.com/ for latest status</Text>
      </Box>
    </Box>
  );
  if (components.length === 0) return <Text> </Text>;

  const dynamicWidth = Math.max(...components.map(c => c.name.replace(' (api.anthropic.com)', '').length)) + 4;

  return (
    <Box flexDirection="column" paddingLeft={1} paddingRight={1} paddingTop={1} borderStyle="round" borderColor={theme.muted} width={54}>
      <Text bold>
        <Text color={theme.accent}>✻</Text>
        <Text color={theme.text}> Claude Status</Text>
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {components.map((comp) => (
          <StatusRow key={comp.id} comp={comp} nameWidth={dynamicWidth} theme={theme} />
        ))}
      </Box>
      <Box marginTop={1}>
        <Text color={theme.muted}>Visit https://status.claude.com/ for latest status</Text>
      </Box>
    </Box>
  );
}