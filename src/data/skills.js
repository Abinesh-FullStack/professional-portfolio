// Tech stack — grouped, with short honest descriptions. No proficiency ratings by design.
// `icon` keys map to src/components/Icon.jsx.

export const skillGroups = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'layout',
    items: [
      { name: 'HTML', desc: 'Semantic, accessible page structure.' },
      { name: 'CSS', desc: 'Layouts, responsive design and transitions.' },
      { name: 'JavaScript', desc: 'Interactivity and application logic in the browser.' },
      { name: 'React', desc: 'Component-based, stateful user interfaces.' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling for consistent UI.' },
      { name: 'Bootstrap', desc: 'Quick, responsive layouts with ready components.' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'server',
    items: [
      { name: 'Python', desc: 'Backend logic, scripting and data work.' },
      { name: 'Django', desc: 'Business applications with models, views and admin.' },
      { name: 'FastAPI', desc: 'Lightweight, typed Python APIs.' },
      { name: 'Node.js', desc: 'JavaScript on the server.' },
      { name: 'Express.js', desc: 'Routing and middleware for Node APIs.' },
      { name: 'REST APIs', desc: 'Designing and integrating resource-based endpoints.' },
    ],
  },
  {
    id: 'databases',
    title: 'Database',
    icon: 'database',
    items: [
      { name: 'MySQL', desc: 'Relational schemas and queries.' },
      { name: 'PostgreSQL', desc: 'Relational data with a robust feature set.' },
      { name: 'SQL', desc: 'Querying, joining and shaping data.' },
    ],
  },
  {
    id: 'data',
    title: 'Data Analytics',
    icon: 'chart',
    items: [
      { name: 'Excel', desc: 'Cleaning, formulas, pivots and quick analysis.' },
      { name: 'Power BI', desc: 'Interactive dashboards and business reports.' },
      { name: 'Data Cleaning', desc: 'Fixing types, gaps and duplicates before analysis.' },
      { name: 'Data Analysis', desc: 'Exploring trends and comparing segments.' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    icon: 'test',
    items: [
      { name: 'Manual Testing', desc: 'Exploring features the way users will.' },
      { name: 'Automation Testing', desc: 'Repeatable checks that run without manual steps.' },
    ],
  },
  {
    id: 'tools',
    title: 'Developer Tools',
    icon: 'tools',
    items: [
      { name: 'Git', desc: 'Version control and branching.' },
      { name: 'GitHub', desc: 'Repositories, reviews and collaboration.' },
    ],
  },
]

export const marqueeItems = [
  'React', 'Django', 'FastAPI', 'Node.js', 'PostgreSQL', 'MySQL', 'Power BI',
  'REST APIs', 'Python', 'Tailwind CSS', 'SQL', 'Git',
]
