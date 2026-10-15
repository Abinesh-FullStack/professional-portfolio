// SAMPLE DATA — illustrative demonstration values for the analytics showcase.
// These are NOT real business results.

export const sampleKpis = [
  { label: 'Employees', value: 248, decimals: 0, suffix: '', note: 'Sample headcount' },
  { label: 'Attendance rate', value: 94.2, decimals: 1, suffix: '%', note: '12-month average' },
  { label: 'Avg. leave days', value: 1.8, decimals: 1, suffix: '', note: 'Per employee / month' },
  { label: 'Open HR requests', value: 17, decimals: 0, suffix: '', note: 'Current queue' },
]

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Two sample metrics the visitor can switch between.
export const sampleSeries = {
  attendance: {
    label: 'Attendance rate',
    unit: '%',
    min: 91,
    max: 96.5,
    ticks: [92, 94, 96],
    decimals: 1,
    values: [92.4, 93.1, 94.0, 93.6, 92.8, 94.5, 95.1, 94.7, 95.3, 94.9, 95.6, 94.4],
  },
  leave: {
    label: 'Avg. leave days',
    unit: 'days',
    min: 0.8,
    max: 3,
    ticks: [1, 2, 3],
    decimals: 1,
    values: [1.4, 1.6, 1.9, 2.4, 2.1, 1.5, 1.3, 1.7, 1.6, 2.2, 1.9, 2.6],
  },
}

export const sampleDepartments = [
  { d: 'Engineering', v: 86 },
  { d: 'Operations', v: 54 },
  { d: 'Sales', v: 41 },
  { d: 'Support', v: 37 },
  { d: 'HR & Admin', v: 18 },
  { d: 'Finance', v: 12 },
]

export const analyticsSteps = [
  { title: 'Data preparation', text: 'Collect the sources, agree on definitions and shape the data into usable tables.' },
  { title: 'Data cleaning', text: 'Handle missing values, fix types, remove duplicates and standardise categories.' },
  { title: 'Exploration', text: 'Look at distributions and trends and compare segments against simple questions.' },
  { title: 'Visualization', text: 'Build focused charts and dashboards that make the pattern obvious.' },
  { title: 'Insights', text: 'Summarise what the data shows — and what it does not — to support a decision.' },
]
