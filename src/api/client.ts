import { type Participant, type SkillPassport } from '../assets/data/Students';
import { toMillis } from '../utils/timestamps';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiParticipant {
  // Identity
  uid: string;
  email: string | null;
  displayName: string | null;
  fullName: string | null;
  photoURL: string | null;

  // Demographics
  gender: string | null;
  ethnicity: string | null;
  dateOfBirth: string | null;

  // Contact
  phone: string | null;
  address: string | null;

  // School
  schoolName: string | null;
  schoolAddress: string | null;

  // Profile metadata
  metadata: {
    bio: string | null;
    pageUrl: string | null;
  };

  // PromiseUnlocked
  selectedPvaId: string | null;

  // Dates
  createdAt: number;
  updatedAt: number;
  lastActiveAt: number;

  // Passport (placeholder until we wire it up)
  skillPassport?: unknown;
}

export function adaptParticipant(raw: ApiParticipant): Participant {
  return {
    uid: raw.uid,

    // Identity
    email: raw.email,
    displayName: raw.displayName,
    fullName: raw.fullName,
    photoURL: raw.photoURL,

    // Demographics
    gender: raw.gender,
    ethnicity: raw.ethnicity,
    dateOfBirth: raw.dateOfBirth,

    // Contact
    phone: raw.phone,
    address: raw.address,

    // School
    schoolName: raw.schoolName,
    schoolAddress: raw.schoolAddress,

    // Metadata
    metadata: raw.metadata,

    // PromiseUnlocked
    selectedPvaId: raw.selectedPvaId,

    // Dates
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    lastActiveAt: raw.lastActiveAt,

    // Passport
    skillPassport: extractSkillPassport(raw),
  };
}

function extractSkillPassport(_raw: ApiParticipant): SkillPassport[] {
  // TODO:
  // Read passport data from Firestore once the backend exposes it.
  return [];
}

interface FetchOptions {
  token?: string;
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, method = 'GET', body } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  console.log(`FULL URL ${BASE_URL}${path}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export interface ParticipantsResponse {
  participants: ApiParticipant[];
  page: number;
  pageSize: number;
}

export async function getParticipantsPage(
  token: string,
  page: number,
  pageSize: number
): Promise<{
  participants: Participant[];
  page: number;
  pageSize: number;
}> {
  const response = await apiFetch<ParticipantsResponse>(
    `/participants?page=${page}&pageSize=${pageSize}`,
    { token }
  );

  console.log('Participants response:', response);

  return {
    participants: response.participants.map(adaptParticipant),
    page: response.page,
    pageSize: response.pageSize,
  };
}

export interface ApiPva {
  id: string;
  name: string;
}

export interface PvaCatalogResponse {
  pvas: ApiPva[];
}

export async function getPvaCatalog(token: string): Promise<ApiPva[]> {
  const response = await apiFetch<PvaCatalogResponse>('/pva-catalog', { token });
  return response.pvas;
}