import { Course, File, SearchResult } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'INF314',
    units: [
      {
        id: '1-1',
        name: 'EC1 - Programmation Web',
        files: [
          { id: '1-1-1', name: 'Cours_1.pdf', type: 'pdf', size: '2.5 MB', date: '2024-03-25', course: 'INF314' },
          { id: '1-1-2', name: 'TP_1.pdf', type: 'pdf', size: '1.2 MB', date: '2024-03-24', course: 'INF314' },
        ],
      },
      {
        id: '1-2',
        name: 'EC2 - Base de données',
        files: [
          { id: '1-2-1', name: 'Cours_2.pdf', type: 'pdf', size: '3.1 MB', date: '2024-03-23', course: 'INF314' },
        ],
      },
    ],
  },
];

export const mockDocuments: File[] = [
  {
    id: '1',
    name: 'Cours_1.pdf',
    type: 'pdf',
    size: '2.5 MB',
    date: '25/03/2024',
    course: 'INF314',
  },
  {
    id: '2',
    name: 'TP_1.pdf',
    type: 'pdf',
    size: '1.2 MB',
    date: '24/03/2024',
    course: 'INF314',
  },
  {
    id: '3',
    name: 'Notes.pdf',
    type: 'pdf',
    size: '3.1 MB',
    date: '23/03/2024',
    course: 'INF145',
  },
];

export const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Cours INF314 - Programmation Web',
    subtitle: 'EC1 - Programmation Web',
    date: '25/03/2024',
  },
  {
    id: '2',
    title: 'TP1 - Base de données',
    subtitle: 'EC2 - Base de données',
    date: '24/03/2024',
  },
  {
    id: '3',
    title: 'Notes de cours INF314',
    subtitle: 'EC1 - Programmation Web',
    date: '23/03/2024',
  },
];

export const recentSearches = [
  'Cours INF314',
  'TP Programmation Web',
  'Base de données',
];

export const searchSuggestions = ['Cours', 'TP', 'Examens', 'Notes']; 