export type Status = "Accepted" | "In Review" | "Pending" | "Rejected";

export interface PassportStamp {
  id: number;
  name: string;
  category: "Technical" | "Leadership" | "Communication" | "Research" | "Community";
  earnedDate: string;
  description: string;
  evidence: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  program: string;
  gpa: number;
  status: Status;
  appliedDate: string;
  address: string;
  birthDate: string;
  expectedGraduation: string;
  stamps: PassportStamp[];
}

export const students: Student[] = [
  { id: 1,  name: "Priya Nair",       email: "priya.nair@email.com",     phone: "(616) 555-0123", program: "Computer Science", gpa: 3.9, status: "Accepted",  appliedDate: "2025-01-03", address: "Grand Rapids, MI",  birthDate: "2003-05-12", expectedGraduation: "May 2026", stamps: [] },
  { id: 2,  name: "Marcus Webb",      email: "marcus.webb@email.com",    phone: "(616) 555-0234", program: "Business Admin",   gpa: 3.4, status: "In Review",  appliedDate: "2025-01-08", address: "Allendale, MI",    birthDate: "2002-11-08", expectedGraduation: "May 2026", stamps: [] },
  { id: 3,  name: "Leila Ahmadi",     email: "leila.ahmadi@email.com",   phone: "(616) 555-0345", program: "Data Science",     gpa: 3.7, status: "In Review",  appliedDate: "2025-01-10", address: "Holland, MI",      birthDate: "2003-03-22", expectedGraduation: "May 2026", stamps: [] },
  { id: 4,  name: "Tom Okafor",       email: "tom.okafor@email.com",     phone: "(616) 555-0456", program: "Mechanical Eng.",  gpa: 2.9, status: "Pending",    appliedDate: "2025-01-15", address: "Muskegon, MI",     birthDate: "2003-07-30", expectedGraduation: "May 2026", stamps: [] },
  { id: 5,  name: "Sophie Chen",      email: "sophie.chen@email.com",    phone: "(616) 555-0567", program: "Computer Science", gpa: 4.0, status: "Accepted",  appliedDate: "2025-01-17", address: "Grand Rapids, MI",  birthDate: "2002-09-14", expectedGraduation: "May 2026", stamps: [] },
  { id: 6,  name: "Diego Reyes",      email: "diego.reyes@email.com",    phone: "(616) 555-0678", program: "Psychology",       gpa: 3.2, status: "Rejected",  appliedDate: "2025-01-19", address: "Kalamazoo, MI",     birthDate: "2003-01-05", expectedGraduation: "May 2026", stamps: [] },
  { id: 7,  name: "Amara Diallo",     email: "amara.diallo@email.com",   phone: "(616) 555-0789", program: "Data Science",     gpa: 3.6, status: "In Review",  appliedDate: "2025-01-22", address: "Grand Rapids, MI", birthDate: "2002-12-19", expectedGraduation: "May 2026", stamps: [] },
  { id: 8,  name: "James Harrington", email: "james.h@email.com",        phone: "(616) 555-0890", program: "Business Admin",   gpa: 3.1, status: "Pending",    appliedDate: "2025-01-25", address: "Holland, MI",      birthDate: "2003-04-27", expectedGraduation: "May 2026", stamps: [] },
  { id: 9,  name: "Yuki Tanaka",      email: "yuki.tanaka@email.com",    phone: "(616) 555-0901", program: "Mechanical Eng.",  gpa: 3.8, status: "Accepted",  appliedDate: "2025-01-28", address: "Muskegon, MI",      birthDate: "2002-10-11", expectedGraduation: "May 2026", stamps: [] },
  { id: 10, name: "Nina Kowalski",    email: "nina.k@email.com",         phone: "(616) 555-1012", program: "Psychology",       gpa: 3.5, status: "In Review",  appliedDate: "2025-02-01", address: "Allendale, MI",    birthDate: "2003-06-16", expectedGraduation: "May 2026", stamps: [] },
  { id: 11, name: "Ethan Brooks",     email: "ethan.brooks@email.com",   phone: "(616) 555-1123", program: "Computer Science", gpa: 3.3, status: "Pending",    appliedDate: "2025-02-03", address: "Grand Haven, MI",  birthDate: "2003-02-18", expectedGraduation: "May 2026", stamps: [] },
  { id: 12, name: "Ava Martinez",     email: "ava.martinez@email.com",   phone: "(616) 555-1234", program: "Data Science",     gpa: 3.9, status: "Accepted",  appliedDate: "2025-02-05", address: "Wyoming, MI",       birthDate: "2002-08-09", expectedGraduation: "May 2026", stamps: [] },
  { id: 13, name: "Noah Peterson",    email: "noah.peterson@email.com",  phone: "(616) 555-1345", program: "Mechanical Eng.",  gpa: 2.8, status: "Rejected",  appliedDate: "2025-02-06", address: "Grand Rapids, MI",  birthDate: "2003-09-01", expectedGraduation: "May 2026", stamps: [] },
  { id: 14, name: "Maya Singh",       email: "maya.singh@email.com",     phone: "(616) 555-1456", program: "Psychology",       gpa: 3.6, status: "In Review", appliedDate: "2025-02-08", address: "Holland, MI",       birthDate: "2002-12-03", expectedGraduation: "May 2026", stamps: [] },
  { id: 15, name: "Liam O'Connor",    email: "liam.oconnor@email.com",   phone: "(616) 555-1567", program: "Business Admin",   gpa: 3.0, status: "Pending",   appliedDate: "2025-02-10", address: "Allendale, MI",     birthDate: "2003-07-14", expectedGraduation: "May 2026", stamps: [] },
  { id: 16, name: "Isabella Rossi",   email: "isabella.rossi@email.com", phone: "(616) 555-1678", program: "Computer Science", gpa: 3.8, status: "Accepted",  appliedDate: "2025-02-12", address: "Muskegon, MI",      birthDate: "2002-05-21", expectedGraduation: "May 2026", stamps: [] },
  { id: 17, name: "David Kim",        email: "david.kim@email.com",      phone: "(616) 555-1789", program: "Data Science",     gpa: 3.4, status: "In Review", appliedDate: "2025-02-14", address: "Grand Rapids, MI",  birthDate: "2003-01-29", expectedGraduation: "May 2026", stamps: [] },
  { id: 18, name: "Hannah Schultz",   email: "hannah.schultz@email.com", phone: "(616) 555-1890", program: "Psychology",       gpa: 3.7, status: "Accepted",  appliedDate: "2025-02-16", address: "Kalamazoo, MI",     birthDate: "2002-10-25", expectedGraduation: "May 2026", stamps: [] },
  { id: 19, name: "Omar Hassan",      email: "omar.hassan@email.com",    phone: "(616) 555-1901", program: "Mechanical Eng.",  gpa: 3.2, status: "Pending",   appliedDate: "2025-02-18", address: "Wyoming, MI",       birthDate: "2003-03-11", expectedGraduation: "May 2026", stamps: [] },
  { id: 20, name: "Grace Thompson",   email: "grace.thompson@email.com", phone: "(616) 555-2012", program: "Business Admin",   gpa: 3.5, status: "In Review", appliedDate: "2025-02-20", address: "Grand Haven, MI",   birthDate: "2002-11-17", expectedGraduation: "May 2026", stamps: [] },
  { id: 21, name: "Lucas Nguyen",     email: "lucas.nguyen@email.com",   phone: "(616) 555-2123", program: "Computer Science", gpa: 3.9, status: "Accepted",  appliedDate: "2025-02-22", address: "Holland, MI",       birthDate: "2003-04-06", expectedGraduation: "May 2026", stamps: [] },
  { id: 22, name: "Zoe Anderson",     email: "zoe.anderson@email.com",   phone: "(616) 555-2234", program: "Data Science",     gpa: 3.1, status: "Rejected",  appliedDate: "2025-02-24", address: "Allendale, MI",     birthDate: "2002-06-30", expectedGraduation: "May 2026", stamps: [] },
  { id: 23, name: "Caleb Johnson",    email: "caleb.johnson@email.com",  phone: "(616) 555-2345", program: "Mechanical Eng.",  gpa: 3.6, status: "In Review", appliedDate: "2025-02-26", address: "Grand Rapids, MI",  birthDate: "2003-08-19", expectedGraduation: "May 2026", stamps: [] },
  { id: 24, name: "Elena Garcia",     email: "elena.garcia@email.com",   phone: "(616) 555-2456", program: "Psychology",       gpa: 3.8, status: "Accepted",  appliedDate: "2025-02-28", address: "Muskegon, MI",      birthDate: "2002-02-13", expectedGraduation: "May 2026", stamps: [] },
  { id: 25, name: "Benjamin Clark",   email: "benjamin.clark@email.com", phone: "(616) 555-2567", program: "Business Admin",   gpa: 2.9, status: "Pending",   appliedDate: "2025-03-01", address: "Kalamazoo, MI",     birthDate: "2003-12-04", expectedGraduation: "May 2026", stamps: [] },
  { id: 26, name: "Sophia Lee",       email: "sophia.lee@email.com",       phone: "(616) 555-2678", program: "Computer Science", gpa: 3.7, status: "In Review", appliedDate: "2025-03-03", address: "Allendale, MI",   birthDate: "2003-03-05", expectedGraduation: "May 2026", stamps: [] },
  { id: 27, name: "Ryan Patel",       email: "ryan.patel@email.com",       phone: "(616) 555-2789", program: "Computer Science", gpa: 3.9, status: "Pending",   appliedDate: "2025-03-04", address: "Grand Rapids, MI", birthDate: "2002-12-11", expectedGraduation: "May 2026", stamps: [] },
  { id: 28, name: "Emma Johnson",     email: "emma.johnson@email.com",     phone: "(616) 555-2890", program: "Business Admin",   gpa: 3.4, status: "Accepted",  appliedDate: "2025-03-05", address: "Allendale, MI",   birthDate: "2003-01-21", expectedGraduation: "May 2026", stamps: [] },
  { id: 29, name: "Liam Chen",        email: "liam.chen@email.com",        phone: "(616) 555-2901", program: "Computer Science", gpa: 4.0, status: "Accepted",  appliedDate: "2025-03-06", address: "Muskegon, MI",    birthDate: "2002-06-19", expectedGraduation: "May 2026", stamps: [] },
  { id: 30, name: "Olivia Martinez",  email: "olivia.martinez@email.com",  phone: "(616) 555-3012", program: "Data Science",     gpa: 3.6, status: "In Review", appliedDate: "2025-03-07", address: "Allendale, MI",   birthDate: "2003-05-02", expectedGraduation: "May 2026", stamps: [] },
  { id: 31, name: "Noah Kim",         email: "noah.kim@email.com",         phone: "(616) 555-3123", program: "Computer Science", gpa: 3.5, status: "Pending",   appliedDate: "2025-03-08", address: "Allendale, MI",   birthDate: "2003-04-12", expectedGraduation: "May 2026", stamps: [] },
  { id: 32, name: "Ava Singh",        email: "ava.singh@email.com",        phone: "(616) 555-3234", program: "Computer Science", gpa: 3.8, status: "Accepted",  appliedDate: "2025-03-09", address: "Grand Rapids, MI", birthDate: "2002-11-09", expectedGraduation: "May 2026", stamps: [] },
  { id: 33, name: "Ethan Liu",        email: "ethan.liu@email.com",        phone: "(616) 555-3345", program: "Mechanical Eng.",  gpa: 3.1, status: "Rejected",  appliedDate: "2025-03-10", address: "Allendale, MI",   birthDate: "2003-07-27", expectedGraduation: "May 2026", stamps: [] },
  { id: 34, name: "Mia Wilson",       email: "mia.wilson@email.com",       phone: "(616) 555-3456", program: "Computer Science", gpa: 3.9, status: "In Review", appliedDate: "2025-03-11", address: "Allendale, MI",   birthDate: "2003-02-14", expectedGraduation: "May 2026", stamps: [] },
  { id: 35, name: "Alexander Brown",  email: "alex.brown@email.com",      phone: "(616) 555-3567", program: "Computer Science", gpa: 3.6, status: "Pending",   appliedDate: "2025-03-12", address: "Holland, MI",     birthDate: "2002-09-23", expectedGraduation: "May 2026", stamps: [] },
];