import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { listsRoutes } from './routes/lists';
import { itemsRoutes } from './routes/items';
import { tagsRoutes } from './routes/tags';
import { autofillRoutes } from './routes/autofill';
import { join } from 'path';
import { existsSync, statSync } from 'fs';

const staticPath = Bun.env.STATIC_PATH || join(import.meta.dir, '../../frontend/build');

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: staticPath,
    prefix: ''
  }))
  .group('/api', (app) => app
    .use(listsRoutes)
    .use(itemsRoutes)
    .use(tagsRoutes)
    .use(autofillRoutes)
  )
  .get('*', async ({ path }) => {
    if (path.startsWith('/api')) return;

    const relativePath = path.startsWith('/') ? path.slice(1) : path;
    const targetFile = join(staticPath, relativePath);

    if (relativePath && existsSync(targetFile) && !statSync(targetFile).isDirectory()) {
      return Bun.file(targetFile);
    }

    const indexPath = join(staticPath, 'index.html');
    if (existsSync(indexPath)) {
      return Bun.file(indexPath);
    }

    return 'List-en-do API Running';
  })
  .listen(Bun.env.PORT || 3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
