export interface PassportCategoryMapping {
  sessionId: string;
  interactionId: string;
  justification: string;
  timestamp: number;
}

export interface SkillPassport {
  category: string;
  level: number;
  firstMappedAt: number;
  lastMappedAt: number;
  totalMappings: number;
  mappings: PassportCategoryMapping[];
}

export interface Participant {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  lastActiveAt: number;
  skillPassport: SkillPassport[];
}

function daysAgo(n: number): number {
  return Date.now() - n * 24 * 60 * 60 * 1000;
}

function mockPassport(categories: string[]): SkillPassport[] {
  return categories.map((category) => ({
    category,
    level: 1,
    firstMappedAt: daysAgo(60),
    lastMappedAt: daysAgo(Math.floor(Math.random() * 30)),
    totalMappings: Math.floor(Math.random() * 8) + 1,
    mappings: [],
  }));
}

export const participants: Participant[] = [
  {
    uid: "uid_001",
    email: "priya.nair@email.com",
    displayName: "Priya Nair",
    photoURL: null,
    createdAt: daysAgo(90),
    lastActiveAt: daysAgo(1),
    skillPassport: mockPassport([
      "Research Skills",
      "Athletics: Team Sport",
      "Leadership: Club / Org Officer",
      "Innovation",
      "Visual Art",
    ]),
  },
  {
    uid: "uid_002",
    email: "marcus.webb@email.com",
    displayName: "Marcus Webb",
    photoURL: null,
    createdAt: daysAgo(85),
    lastActiveAt: daysAgo(3),
    skillPassport: mockPassport([
      "Family Responsibilities: Household Manager",
      "Tutoring: Peer Tutoring",
      "Internship: STEM / Technical",
      "Mentorship",
      "Skill Development",
      "Game Design",
    ]),
  },
  {
    uid: "uid_003",
    email: "leila.ahmadi@email.com",
    displayName: "Leila Ahmadi",
    photoURL: null,
    createdAt: daysAgo(80),
    lastActiveAt: daysAgo(2),
    skillPassport: mockPassport([
      "Music: Vocalist",
      "Performance: Dance",
      "Public Speaking: Speech / Oratory",
    ]),
  },
  {
    uid: "uid_004",
    email: "tom.okafor@email.com",
    displayName: "Tom Okafor",
    photoURL: null,
    createdAt: daysAgo(75),
    lastActiveAt: daysAgo(7),
    skillPassport: mockPassport([
      "Academic Competition: Math / Science Olympiad",
      "Research Skills",
      "Navigating Loss or Grief",
      "Life Balance",
      "Troubleshooting",
    ]),
  },
  {
    uid: "uid_005",
    email: "sophie.chen@email.com",
    displayName: "Sophie Chen",
    photoURL: null,
    createdAt: daysAgo(70),
    lastActiveAt: daysAgo(0),
    skillPassport: mockPassport([
      "Leadership: Club / Org Officer",
      "Entrepreneurship: Business Started",
      "Research Skills",
    ]),
  },
  {
    uid: "uid_006",
    email: "diego.reyes@email.com",
    displayName: "Diego Reyes",
    photoURL: null,
    createdAt: daysAgo(68),
    lastActiveAt: daysAgo(5),
    skillPassport: mockPassport([
      "Family Responsibilities: Household Manager",
      "Tutoring: Peer Tutoring",
      "Leadership: Team Captain",
    ]),
  },
  {
    uid: "uid_007",
    email: "amara.diallo@email.com",
    displayName: "Amara Diallo",
    photoURL: null,
    createdAt: daysAgo(65),
    lastActiveAt: daysAgo(1),
    skillPassport: mockPassport([
      "Entrepreneurship: Business Started",
      "Event Planning: Community Event",
      "Language & Multilingualism",
    ]),
  },
  {
    uid: "uid_008",
    email: "james.h@email.com",
    displayName: "James Harrington",
    photoURL: null,
    createdAt: daysAgo(60),
    lastActiveAt: daysAgo(10),
    skillPassport: mockPassport([
      "Athletics: Team Sport",
      "Leadership: Team Captain",
      "Conflict Resolution",
      "Self-Reflection",
      "Life Balance",
    ]),
  },
  {
    uid: "uid_009",
    email: "yuki.tanaka@email.com",
    displayName: "Yuki Tanaka",
    photoURL: null,
    createdAt: daysAgo(55),
    lastActiveAt: daysAgo(2),
    skillPassport: mockPassport([
      "Academic Competition: Coding / Hackathon",
      "Entrepreneurship: Product / App Created",
      "Internship: STEM / Technical",
    ]),
  },
  {
    uid: "uid_010",
    email: "nina.k@email.com",
    displayName: "Nina Kowalski",
    photoURL: null,
    createdAt: daysAgo(50),
    lastActiveAt: daysAgo(4),
    skillPassport: mockPassport([
      "Leadership",
      "Critical Thinking",
      "DIY & Fabrication",
      "Tutoring: Peer Tutoring",
      "Artistic Creation",
      "Music: Vocalist",
      "Visual Art",
      "Strategic Planning",
      "Client Relations",
      "Self-Improvement",
      "Coding & Programming",
    ]),
  },
  {
    uid: "uid_011",
    email: "ethan.brooks@email.com",
    displayName: "Ethan Brooks",
    photoURL: null,
    createdAt: daysAgo(48),
    lastActiveAt: daysAgo(6),
    skillPassport: mockPassport([
      "Research Skills",
    ]),
  },
  {
    uid: "uid_012",
    email: "ava.martinez@email.com",
    displayName: "Ava Martinez",
    photoURL: null,
    createdAt: daysAgo(45),
    lastActiveAt: daysAgo(1),
    skillPassport: mockPassport([
      "Tutoring: Community / Youth Tutoring",
      "Leadership: Peer Mentor or Tutor",
      "Public Speaking: Speech / Oratory",
      "Career Planning",
      "Culinary Arts",
      "Music: Instrumentalist",
    ]),
  },
];