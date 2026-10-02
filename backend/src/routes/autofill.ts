import { Elysia } from 'elysia';

export const autofillRoutes = new Elysia({ prefix: '/autofill' })
  .get('/search', async () => {
    return { results: [] };
  })
  .get('/details', async () => {
    return { data: null };
  });
