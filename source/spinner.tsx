import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { Theme } from './theme.js';

const SPINNER_FRAMES = ["·", "·", "✢", "✳", "✶", "✻", "✽", "✽", "✻", "✶", "✳", "✢"];

export default function Spinner({ text, theme }: { text: string; theme: Theme }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => setTime(Date.now() - startTime), 10);
    return () => clearInterval(interval);
  }, []);

  const frame = Math.floor(time / 120) % SPINNER_FRAMES.length;
  const glimmerIndex = (Math.floor(time / 50) % (text.length + 20)) - 10;

  return (
    <Box padding={1} flexDirection="row">
      <Box width={2}>
        <Text color={theme.accent}>{SPINNER_FRAMES[frame]}</Text>
      </Box>
      <Text>
        {text.split('').map((char, index) => {
          const isHighlighted = Math.abs(index - glimmerIndex) <= 1;
          return (
            <Text key={index} color={isHighlighted ? theme.shimmer : theme.base}>
              {char}
            </Text>
          );
        })}
      </Text>
    </Box>
  );
}