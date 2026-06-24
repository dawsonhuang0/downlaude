export type MockComponent = {id: string; name: string; status: string};

export const defaultComponents: MockComponent[] = [
  {id: '1', name: 'Claude Code', status: 'operational'},
  {id: '2', name: 'Claude API (api.anthropic.com)', status: 'operational'},
  {id: '3', name: 'claude.ai', status: 'operational'},
];

export function mockFetch(components: MockComponent[] = defaultComponents) {
  globalThis.fetch = (async () => ({
    json: async () => ({components}),
  })) as any;
}

// ink v7 writes an empty frame on exit, so lastFrame() is blank after done.
// Use the last non-empty frame captured in frames[] instead.
export const lastContent = (frames: string[]) =>
  [...frames].reverse().find(f => (f?.trim().length ?? 0) > 1) ?? '';
