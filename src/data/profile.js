// ─────────────────────────────────────────────────────────────
//  PROFILE — edit this file to update your personal details.
//  Empty strings ("") are hidden on the site automatically.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Abinesh V',
  firstName: 'Abinesh',
  roles: ['Full Stack Developer', 'Automation Testing', 'Data Analytics'],

  // Small status pill in the hero. Set to "" to hide it.
  availability: 'Open to connect',

  headline: ['Building Digital Experiences.', 'Engineering Better Solutions.'],
  intro:
    'I build practical digital solutions, improve software quality, and turn data into meaningful insights.',

  company: 'Kenshin Systems Pvt Ltd',
  companyShort: 'Kenshin Systems',
  currentRole: 'Full Stack Developer',
  experienceStart: 'September 2024',
  experienceYears: 2, // "approximately 2 years" — keep in sync with reality

  // ── YOUR EMAIL ────────────────────────────────────────────
  // Replace '' with your real address, e.g. 'name@example.com'.
  // It powers the scratch card, copy-email buttons, the command
  // palette and the terminal. While empty, nothing fake is shown.
  email: '',

  location: '', // optional, e.g. 'Chennai, India'

  links: {
    linkedin: 'https://www.linkedin.com/in/abinesh-v-7496b32b2',
    github: 'https://github.com/Abinesh-FullStack',
    // Optional: path or URL to a real resume PDF, e.g. 'resume.pdf' placed in /public.
    resume: '',
  },

  about: {
    title: 'More Than',
    titleAccent: 'Just Code.',
    paragraphs: [
      "I'm Abinesh V, a developer focused on building practical digital solutions across full-stack development, automation testing, and data analytics.",
      'I enjoy turning requirements into usable applications, integrating frontend and backend systems, improving software quality, and transforming data into meaningful insights.',
      'My approach combines problem-solving, continuous learning, and attention to detail to build solutions that are useful, reliable, and maintainable.',
    ],
    labels: ['Full Stack Development', 'Automation Testing', 'Data Analytics', 'REST APIs', 'Databases', 'Problem Solving'],
  },

  contact: {
    headline: 'Have an Idea?',
    headlineAccent: "Let's Build Something Meaningful.",
    text: "I'm open to connecting about software development, automation testing, data analytics, and interesting technical challenges.",
  },
}

export const experience = [
  {
    company: 'Kenshin Systems Pvt Ltd',
    role: 'Full Stack Developer',
    start: 'Sep 2024',
    end: '', // empty while you are in this role — shows "Present"
    summary:
      'Working across the stack on business applications — from interfaces and APIs to databases, testing, and reporting.',
    // Areas of work, grouped. Edit freely — these describe the scope of the role,
    // not claims that every item applied to every project.
    // Areas of work, grouped. Edit freely — these describe the scope of the role,
    // not claims that every item applied to every project.
    groups: [
      {
        title: 'Application development',
        items: ['Full-stack application development', 'Django and Python development', 'Frontend implementation'],
      },
      {
        title: 'Data & integration',
        items: ['Database integration', 'API development', 'Data analysis projects'],
      },
      {
        title: 'Quality',
        items: ['Testing and debugging'],
      },
    ],
  },
]

// Only verified items belong here.
export const milestones = [
  {
    date: 'Sep 2024',
    title: 'Joined Kenshin Systems Pvt Ltd',
    text: 'Started as a Full Stack Developer working on business applications.',
    type: 'Professional',
  },
  {
    date: 'Ongoing',
    title: 'Building the AI Data Analyst concept',
    text: 'A personal project exploring dataset upload, cleaning, and visual analysis.',
    type: 'Project',
  },
  {
    date: 'Ongoing',
    title: 'Learning applied machine learning',
    text: 'Exploring prediction workflows through the Employee Attrition Predictor learning project.',
    type: 'Learning',
  },
]

// Example: { name: 'Certification name', issuer: 'Issuer', year: '2025', url: '' }
export const certifications = []
