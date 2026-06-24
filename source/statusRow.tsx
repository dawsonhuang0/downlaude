import {Text, Box} from 'ink';
import {Theme} from './theme.js';

const stripSuffix = (name: string) => name.replace(/\s*\([^)]+\)$/, '');

export default function StatusRow({
  comp,
  nameWidth,
  statusColWidth,
  theme,
  all,
  layout,
}: {
  comp: any;
  nameWidth: number;
  statusColWidth: number;
  theme: Theme;
  all: boolean;
  layout: 'inline_full' | 'stacked_full' | 'stacked_short';
}) {
  let icon = '✔';
  let statusText = 'Operational';
  let shortText = 'OK';
  let color = theme.operational;

  if (comp.status === 'major_outage') {
    icon = '✘';
    statusText = 'Major outage';
    shortText = 'Major';
    color = theme.major;
  } else if (comp.status !== 'operational') {
    icon = '✘';
    statusText = 'Partial outage';
    shortText = 'Partial';
    color = theme.partial;
  }

  const name = all ? comp.name : stripSuffix(comp.name);
  const displayStatus = layout === 'stacked_short' ? shortText : statusText;

  if (layout === 'stacked_full' || layout === 'stacked_short') {
    return (
      <Box flexDirection="column">
        <Text>{name}</Text>
        <Box>
          <Text color={theme.muted}>{' └ '}</Text>
          <Text color={color}>
            <Text bold>{icon}</Text>
            {` ${displayStatus}`}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box width={nameWidth}>
        <Text>{name}</Text>
      </Box>
      <Box width={statusColWidth}>
        <Text color={color}>
          <Text bold>{icon}</Text>
          {` ${statusText}`}
        </Text>
      </Box>
    </Box>
  );
}
