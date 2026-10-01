// SEED DATA: realistic starter data so the app never looks empty on first launch.
export const seedData = {
  profile: { name: 'Shazia Mansoor', title: 'Software Engineering Student', goal: 'Software Engineer' },
  skills: [
    { id: 's1', name: 'HTML/CSS', category: 'Web Development', percent: 85 },
    { id: 's2', name: 'JavaScript', category: 'Web Development', percent: 65 },
    { id: 's3', name: 'SQL', category: 'Database', percent: 55 },
    { id: 's4', name: 'Git/GitHub', category: 'Tools', percent: 45 },
    { id: 's5', name: 'Python', category: 'Programming', percent: 60 }
  ],
  resume: {
    fullName: 'Shazia Mansoor', title: 'Software Engineering Student', email: 'shazia@example.com',
    phone: '', location: 'Lahore, Pakistan', summary: 'Software engineering student building practical web and data projects.',
    degree: 'BS Software Engineering', university: 'University of Engineering', linkedin: '', github: ''
  },
  interview: { practiced: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] },
  jobs: [],
  projects: [
    { id: 'p1', name: 'Restaurant Sentiment Analysis', description: 'NLP model that classifies restaurant reviews as positive or negative.', tech: ['Python', 'NLP', 'Machine Learning'], github: 'https://github.com/', demo: '', image: '', date: '2025-06-01' },
    { id: 'p2', name: 'Photo Gallery', description: 'Responsive gallery with filtering and a lightbox viewer.', tech: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/', demo: 'https://example.com/', image: '', date: '2025-03-01' },
    { id: 'p3', name: 'CareerHub', description: 'Career readiness platform for students and fresh graduates.', tech: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/', demo: '', image: '', date: '2025-09-01' }
  ]
};
