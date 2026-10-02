import { FieldDefinition } from '../types';

export const movieTemplate = {
  field_definitions: [
    { name: 'director', type: 'text', label: 'Director' },
    { name: 'year', type: 'number', label: 'Release Year' },
    { name: 'genre', type: 'text', label: 'Genre' }
  ] as FieldDefinition[],
  status_options: ['Plan to Watch', 'Watching', 'Completed', 'Dropped']
};

export const animeTemplate = {
  field_definitions: [
    { name: 'studio', type: 'text', label: 'Studio' },
    { name: 'episodes', type: 'number', label: 'Episodes' },
    { name: 'season', type: 'text', label: 'Season' }
  ] as FieldDefinition[],
  status_options: ['Plan to Watch', 'Watching', 'Completed', 'On Hold', 'Dropped']
};

export const bookTemplate = {
  field_definitions: [
    { name: 'author', type: 'text', label: 'Author' },
    { name: 'pages', type: 'number', label: 'Total Pages' },
    { name: 'publisher', type: 'text', label: 'Publisher' }
  ] as FieldDefinition[],
  status_options: ['Plan to Read', 'Reading', 'Completed', 'On Hold']
};

export const taskTemplate = {
  field_definitions: [
    { name: 'notes', type: 'text', label: 'Notes' }
  ] as FieldDefinition[],
  status_options: ['Todo', 'In Progress', 'Done']
};
