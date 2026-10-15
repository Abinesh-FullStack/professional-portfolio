// ─────────────────────────────────────────────────────────────
//  PROJECTS — all project content and links live here.
//
//  github / demo: leave "" until you have a real URL. Empty
//  actions are hidden; the card shows "Links coming soon".
//  status:  'Built' | 'In development' | 'Concept' | 'Learning project' | 'Ongoing'
//  features[].state: 'done' | 'in-progress' | 'planned'
//  mockup:  which local illustrative preview to render (ProjectMockup.jsx)
//  image:   optional real screenshot import — replaces the mockup when set
// ─────────────────────────────────────────────────────────────

export const categories = {
  fullstack: { label: 'Full Stack', tone: 'olive' },
  data: { label: 'Data Analytics', tone: 'sand' },
  testing: { label: 'Testing', tone: 'sage' },
}

export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'data', label: 'Data Analytics' },
  { id: 'testing', label: 'Testing' },
]

export const projects = [
  {
    id: 'hrms-platform',
    title: 'HRMS Platform',
    category: 'fullstack',
    status: 'Built',
    summary: 'An HR management application supporting employee-related workflows and business operations.',
    objective:
      'An HR management application supporting employee-related workflows and business operations — employee information, attendance, leave and day-to-day HR processes.',
    contribution: 'Full-stack development of business workflows — data models, server-side logic, and the user interface.',
    stack: ['Python', 'Django', 'JavaScript', 'SQL'],
    features: [
      { label: 'Employee records', state: 'done' },
      { label: 'Attendance workflows', state: 'done' },
      { label: 'Leave management', state: 'done' },
    ],
    mockup: 'hrms',
    image: null,
    github: '',
    demo: '',
  },
  {
    id: 'ai-data-analyst',
    title: 'AI Data Analyst',
    category: 'data',
    status: 'In development',
    summary: 'Dataset upload, data preparation, analysis and visualisation — in development.',
    objective:
      'A data-analysis application concept involving dataset upload, data preparation, analysis, and visualization.',
    contribution: 'Personal project — designing the workflow, API and analysis pipeline.',
    stack: ['React', 'FastAPI', 'Python'],
    features: [
      { label: 'Dataset upload', state: 'in-progress' },
      { label: 'Guided data cleaning', state: 'planned' },
      { label: 'Analysis & visualisation', state: 'planned' },
    ],
    mockup: 'analyst',
    image: null,
    github: '',
    demo: '',
  },
  {
    id: 'react-node-crud',
    title: 'Full Stack Web Application',
    category: 'fullstack',
    status: 'Built',
    summary: 'Frontend interactions, API integration and database-backed CRUD operations.',
    objective:
      'A full-stack application demonstrating frontend interactions, API integration, and database-backed CRUD operations.',
    contribution: 'Built end to end — React interface, Express API and the data layer.',
    stack: ['React', 'Node.js', 'Express.js', 'SQL'],
    features: [
      { label: 'Create / read / update / delete', state: 'done' },
      { label: 'Form handling', state: 'done' },
      { label: 'REST API integration', state: 'done' },
    ],
    mockup: 'crud',
    image: null,
    github: '',
    demo: '',
  },
  {
    id: 'attrition-predictor',
    title: 'Employee Attrition Predictor',
    category: 'data',
    status: 'Concept',
    summary: 'A proposed machine-learning project exploring employee attrition analysis.',
    objective:
      'A proposed machine-learning project exploring employee attrition analysis. A concept until the implementation exists.',
    contribution: 'Learning project — exploratory analysis and model experiments.',
    stack: ['Python', 'Pandas', 'Scikit-learn'],
    features: [
      { label: 'Exploratory data analysis', state: 'in-progress' },
      { label: 'Model training', state: 'planned' },
      { label: 'Prediction interface', state: 'planned' },
    ],
    mockup: 'attrition',
    image: null,
    github: '',
    demo: '',
  },
  {
    id: 'testing-showcase',
    title: 'Automation Testing Showcase',
    category: 'testing',
    status: 'Ongoing',
    summary: 'Test cases, regression testing, API testing and automation examples.',
    objective:
      'A showcase of test cases, regression testing, API testing, and automation examples.',
    contribution: 'Documenting structured test design and reporting practice.',
    // Confirmed practices/tools only. Add automation frameworks once used.
    stack: ['Manual Testing', 'Regression Testing', 'API Testing'],
    features: [
      { label: 'Test scenarios & cases', state: 'in-progress' },
      { label: 'Bug report samples', state: 'in-progress' },
      { label: 'Automation examples', state: 'planned' },
    ],
    mockup: 'testing',
    image: null,
    github: '',
    demo: '',
  },
]
