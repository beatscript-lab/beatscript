import { config } from './config.js';

const listeners = new Set();
export const server = { languages: [], checked: false, reachable: false, pistonUp: false, error: null };

export function onServerChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export async function refreshServer() {
  if (!config.runnerUrl) {            // no runner configured: do not contact anything
    server.reachable = false; server.pistonUp = false; server.languages = [];
    server.error = 'not configured'; server.checked = true;
    listeners.forEach((fn) => fn());
    return;
  }
  try {
    const res = await fetch(config.runnerUrl + '/health', { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    server.reachable = true;
    server.error = null;
    server.pistonUp = data.pistonUp !== false;
    server.languages = data.ok && Array.isArray(data.languages) ? data.languages : [];
  } catch (e) {
    server.reachable = false;
    server.pistonUp = false;
    server.error = String((e && e.message) || e);
    server.languages = [];
  }
  server.checked = true;
  listeners.forEach((fn) => fn());
}

// Resolves to the gateway's answer, or { error: 'rate' | 'busy' | 'too_large' | 'runner_down' | 'net' }.
export async function runRemote(language, code) {
  if (!config.runnerUrl) return { error: 'runner_down' };
  try {
    const res = await fetch(config.runnerUrl + '/run', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ language, code }),
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data;
    if (res.status === 429) return { error: 'rate' };
    if (res.status === 503) return { error: 'busy' };
    if (res.status === 413) return { error: 'too_large' };
    return { error: 'runner_down' };
  } catch {
    return { error: 'net' };
  }
}
