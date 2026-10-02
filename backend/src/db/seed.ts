import { db } from './connection';
import { lists } from './schema';
import { movieTemplate, animeTemplate, bookTemplate, taskTemplate } from '../templates';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('Seeding data...');
  const countRes = await db.select({ count: sql<number>`count(*)` }).from(lists);
  if (Number(countRes[0].count) === 0) {
    console.log('Inserting default templates...');
    await db.insert(lists).values([
      {
        name: 'Movie Watchlist',
        icon: '🎬',
        template_type: 'movie',
        field_definitions: movieTemplate.field_definitions,
        status_options: movieTemplate.status_options,
      },
      {
        name: 'Anime Watchlist',
        icon: '🍥',
        template_type: 'anime',
        field_definitions: animeTemplate.field_definitions,
        status_options: animeTemplate.status_options,
      },
      {
        name: 'Reading List',
        icon: '📚',
        template_type: 'book',
        field_definitions: bookTemplate.field_definitions,
        status_options: bookTemplate.status_options,
      },
      {
        name: 'Tasks',
        icon: '✅',
        template_type: 'task',
        field_definitions: taskTemplate.field_definitions,
        status_options: taskTemplate.status_options,
      }
    ]);
    console.log('Seed completed successfully');
  } else {
    console.log('Database already has lists, skipping seed.');
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed!', err);
  process.exit(1);
});
