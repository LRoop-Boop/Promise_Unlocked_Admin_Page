export type TaxonomyStamp = string;

export interface TaxonomyCategory {
  name: string;
  stamps: TaxonomyStamp[];
}

export interface TaxonomyDomain {
  name: string;
  categories: TaxonomyCategory[];
}

export interface Taxonomy {
  domains: TaxonomyDomain[];
}

export const taxonomy: Taxonomy = {
  domains: [
    {
      name: "Human Skills (Durable)",
      categories: [
        {
          name: "Research",
          stamps: [
            "Independent Research Project",
            "Science Fair / Expo Participant",
            "Oral History / Interview Project",
          ],
        },
        {
          name: "Athletics",
          stamps: [
            "Team Sport",
            "Individual Sport",
            "Adaptive / Para Athletics",
            "Outdoor & Adventure Sport",
          ],
        },
        {
          name: "General",
          stamps: [
            "Collaboration",
            "Conflict Resolution",
            "Mentorship Received",
            "Cross-Cultural Communication",
          ],
        },
      ],
    },
    {
      name: "Meta-Learning & Self-Awareness",
      categories: [
        {
          name: "Leadership",
          stamps: [
            "Club / Org Officer",
            "Peer Mentor or Tutor",
            "Team Captain",
          ],
        },
        {
          name: "General",
          stamps: [
            "Goal Setting",
            "Self-Advocacy",
            "Overcoming Failure",
            "Journaling & Reflection",
            "Navigating Hardship",
            "Learning a New Skill Independently",
          ],
        },
      ],
    },
    {
      name: "Maker & Builder Skills",
      categories: [
        {
          name: "Event Planning",
          stamps: ["School Event", "Community Event"],
        },
        {
          name: "General",
          stamps: [
            "DIY & Fabrication",
            "Culinary Arts",
            "Fashion & Textile",
            "Home & Facilities",
            "Vehicle / Mechanical Work",
            "Garden & Land Stewardship",
            "Prototype / Invention",
          ],
        },
      ],
    },
    {
      name: "Civic & Community Impact",
      categories: [
        {
          name: "Family Responsibilities",
          stamps: [
            "Primary Caregiver",
            "Sibling Mentor",
            "Household Manager",
          ],
        },
        {
          name: "Tutoring",
          stamps: [
            "Peer Tutoring",
            "Community / Youth Tutoring",
          ],
        },
        {
          name: "General",
          stamps: [
            "Student Government",
            "Volunteering",
            "Environmental Action",
            "Advocacy & Activism",
            "Religious / Faith Service",
            "Neighborhood Stewardship",
          ],
        },
      ],
    },
    {
      name: "Creative Expression & Communication",
      categories: [
        {
          name: "Music",
          stamps: [
            "Vocalist",
            "Instrumentalist",
            "Songwriter / Composer",
            "DJ / Music Producer",
          ],
        },
        {
          name: "Performance",
          stamps: ["Dance", "Stand-Up / Comedy"],
        },
        {
          name: "Public Speaking",
          stamps: ["Debate", "Speech / Oratory"],
        },
        {
          name: "Theater",
          stamps: ["Acting", "Stagecraft / Tech Theater"],
        },
        {
          name: "General",
          stamps: [
            "Visual Art",
            "Photography & Film",
            "Writing & Storytelling",
            "Podcasting / Broadcasting",
          ],
        },
      ],
    },
    {
      name: "Problem-Solving & Systems Thinking",
      categories: [
        {
          name: "Academic Competition",
          stamps: [
            "Math / Science Olympiad",
            "Debate / Model UN",
            "Coding / Hackathon",
          ],
        },
        {
          name: "General",
          stamps: [
            "Strategic Games",
            "Engineering Challenge",
            "Logic & Puzzle Mastery",
            "Systems Design",
          ],
        },
      ],
    },
    {
      name: "Work & Entrepreneurial Experience",
      categories: [
        {
          name: "Internship",
          stamps: [
            "STEM / Technical",
            "Creative / Media",
            "Nonprofit / Civic",
          ],
        },
        {
          name: "Early Job",
          stamps: [
            "Retail / Food Service",
            "Agricultural / Seasonal",
            "Childcare / Elder Care",
          ],
        },
        {
          name: "General",
          stamps: ["Freelance Work", "Gig Economy"],
        },
      ],
    },
    {
      name: "Future Self & Directionality",
      categories: [
        {
          name: "Entrepreneurship",
          stamps: ["Business Started", "Product / App Created"],
        },
        {
          name: "Niche Interest & Expertise",
          stamps: ["Collector / Curator", "Self-Taught Expert"],
        },
        {
          name: "General",
          stamps: [
            "College Exploration",
            "Career Shadowing",
            "Personal Mission Statement",
          ],
        },
      ],
    },
    {
      name: "Digital & Tech Fluency",
      categories: [
        {
          name: "General",
          stamps: [
            "Coding & Programming",
            "Game Design",
            "Social Media & Content Creation",
            "Data & Analytics",
            "Digital Safety & Ethics",
            "AI / Emerging Tech",
          ],
        },
      ],
    },
    {
      name: "Wellbeing & Personal Resilience",
      categories: [
        {
          name: "General",
          stamps: [
            "Mental Health Advocacy",
            "Physical Wellness Practice",
            "Recovery & Perseverance",
            "Mindfulness & Meditation",
            "Navigating Loss or Grief",
          ],
        },
      ],
    },
    {
      name: "Faith, Culture & Identity",
      categories: [
        {
          name: "General",
          stamps: [
            "Heritage & Cultural Practice",
            "Language & Multilingualism",
            "Faith Community Involvement",
            "First-Generation Experience",
            "Immigration & Transition Story",
            "Indigenous Knowledge & Practice",
          ],
        },
      ],
    },
  ],
};

export default taxonomy;