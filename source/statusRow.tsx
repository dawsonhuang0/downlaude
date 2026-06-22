import React from 'react';
import { Text, Box } from 'ink';
import { Theme } from './theme.js';

const stripSuffix = (name: string) => name.replace(/\s*\([^)]+\)$/, '');

export default function StatusRow({ comp, nameWidth, theme, all }: { comp: any; nameWidth: number; theme: Theme; all: boolean }) {
  let icon = '✔';
  let statusText = 'Operational';
  let color = theme.operational;

  if (comp.status === 'major_outage') {
    icon = '✘';
    statusText = 'Major outage';
    color = theme.major;
  } else if (comp.status !== 'operational') {
    icon = '✘';
    statusText = 'Partial outage';
    color = theme.partial;
  }

  return (
    <Box>
      <Box width={nameWidth}>
        <Text>{all ? comp.name : stripSuffix(comp.name)}</Text>
      </Box>
      <Text color={color}>
        <Text bold>{icon}</Text>
        <Text> {statusText}</Text>
      </Text>
    </Box>
  );
}