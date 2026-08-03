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
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;

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

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, method = 'GET', body } = options;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}: ${path}`);
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

export interface StampInstance {
  stampName: string;
  category: string;
  categoryId: string;
  tier: number;
  timesUnlocked: number;
  firstUnlockedAt: string;
  lastUnlockedAt: string;
  participantId: string;
  sessionId: string;
}

export async function getParticipantStamps(
  token: string,
  participantId: string
): Promise<StampInstance[]> {
  const res = await fetch(`${BASE_URL}/admin/stamps/participants/${participantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to load stamps (${res.status})`);
  const data = await res.json();
  return data.stamps ?? [];
}

export interface StampEvidenceInteraction {
  id: string;
  sequenceIndex: number;
  question: string;
  answer: string;
  justification: string;
  mappingOutcome: string;
  mappedCategory: string;
  specificStamp: string;
  timestamp: string;
}

export async function getStampEvidence(
  token: string,
  participantId: string,
  sessionId: string,
  stampName: string
): Promise<{ stamp: StampInstance; interactions: StampEvidenceInteraction[] }> {
  const res = await fetch(
    `${BASE_URL}/admin/stamps/participants/${participantId}/sessions/${sessionId}/stamps/${encodeURIComponent(
      stampName
    )}/evidence`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Failed to load stamp evidence (${res.status})`);
  return res.json();
}

export interface AdminSessionSummary {
  sessionId: string;
  status: string;
  startedAt: string;
  lastActiveAt: string;
  completedAt: string | null;
  totalInteractions: number;
}

export async function getParticipantSessions(
  token: string,
  participantId: string
): Promise<AdminSessionSummary[]> {
  const res = await fetch(`${BASE_URL}/sessions?participantId=${participantId}&pageSize=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to load sessions (${res.status})`);
  const data = await res.json();
  return data.sessions ?? [];
}

export interface SessionInteraction {
  id: string;
  sequenceIndex: number;
  question: string;
  answer: string;
  mappingOutcome: string;
  isWeakFit: boolean;
  timestamp: string;
}

export async function getSessionDetail(token: string, sessionId: string) {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to load session (${res.status})`);
  return res.json() as Promise<{
    session: AdminSessionSummary;
    interactions: SessionInteraction[];
  }>;
}

export interface StampCategorySummary {
  category: string;
  stampInstances: number;
  distinctStamps: number;
  totalUnlocks: number;
  participants: number;
  sessions: number;
}

export interface StampCategorySummaryResponse {
  categories: StampCategorySummary[];
}

export async function getStampCategorySummary(
  token: string
): Promise<StampCategorySummary[]> {
  const response = await apiFetch<StampCategorySummaryResponse>(
    '/admin/stamps/categories',
    { token }
  );
  return response.categories;
}

export interface PassportCategory {
  category: string;
  totalMappings: number;
  unlockedStampCount: number;
}

export interface ParticipantPassportSummary {
  uid: string;
  displayName: string | null;
  email: string | null;
  schoolName: string | null;
  passport: PassportCategory[];
  totalStampsUnlocked: number;
  totalMappings: number;
  sessionStatusCounts: { completed: number; in_progress: number; abandoned: number };
}

interface AllPassportsResponse {
  participants: ParticipantPassportSummary[];
  total: number;
  errors?: { uid: string; error: string }[];
}

export async function getAllPassports(token: string): Promise<ParticipantPassportSummary[]> {
  const response = await apiFetch<AllPassportsResponse>('/participants/passport/all', { token });
  if (response.errors?.length) {
    console.warn('Some participant passports failed to load:', response.errors);
  }
  return response.participants;
}