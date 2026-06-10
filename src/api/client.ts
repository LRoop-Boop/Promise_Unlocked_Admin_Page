import { type Participant, type SkillPassport } from '../assets/data/Students';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// What the real API actually returns today
export interface ApiParticipant {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  updatedAt: number;
  metadata: Record<string, unknown>;
  // skillPassport will be added here once the backend supports it
}

// Bridges ApiParticipant → Participant (your frontend shape)
export function adaptParticipant(raw: ApiParticipant): Participant {
  return {
    uid: raw.uid,
    email: raw.email,
    displayName: raw.displayName,
    photoURL: raw.photoURL,
    createdAt: raw.createdAt,
    lastActiveAt: raw.updatedAt, // API calls it updatedAt for now
    skillPassport: extractSkillPassport(raw),
  };
}

// TODO: replace this once the backend returns passport data
function extractSkillPassport(_raw: ApiParticipant): SkillPassport[] {
  // When the API starts returning passport data, map it here.
  // For now, every real participant starts with an empty passport.
  return [];
}

interface FetchOptions {
  token?: string;
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, method = 'GET', body } = options;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body)  headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}