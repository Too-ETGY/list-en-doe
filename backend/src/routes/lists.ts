import { Elysia, t } from 'elysia';
import { db } from '../db/connection';
import { lists } from '../db/schema';
import { eq, asc, sql } from 'drizzle-orm';
import { movieTemplate, animeTemplate, bookTemplate, taskTemplate } from '../templates';

function getTemplate(type: string) {
  switch (type) {
    case 'movie': return movieTemplate;
    case 'anime': return animeTemplate;
    case 'book': return bookTemplate;
    case 'task': return taskTemplate;
    default: return { field_definitions: [], status_options: [] };
  }
}

export const listsRoutes = new Elysia({ prefix: '/lists' })
  .get('/', async () => {
    return await db.select().from(lists).orderBy(asc(lists.sort_order));
  })
  .post('/', async ({ body }) => {
    const data = body as any;
    let field_definitions = [];
    let status_options: string[] = [];

    if (data.template_type) {
      const template = getTemplate(data.template_type);
      field_definitions = data.field_definitions && data.field_definitions.length > 0 
        ? data.field_definitions 
        : template.field_definitions;
      status_options = data.status_options && data.status_options.length > 0 
        ? data.status_options 
        : template.status_options;
    } else {
      field_definitions = data.field_definitions || [];
      status_options = data.status_options || [];
    }

    const maxSort = await db.select({ max: sql<number>`MAX(sort_order)` }).from(lists);
    const nextSort = (maxSort[0]?.max ?? -1) + 1;

    const [newList] = await db.insert(lists).values({
      name: data.name,
      icon: data.icon,
      template_type: data.template_type,
      field_definitions,
      status_options,
      sort_order: nextSort,
    }).returning();
    return newList;
  }, {
    body: t.Object({
      name: t.String(),
      icon: t.String(),
      template_type: t.Optional(t.String()),
    })
  })
  .put('/reorder', async ({ body }) => {
    const listUpdates = body as { id: string; sort_order: number }[];
    for (const update of listUpdates) {
      await db.update(lists)
        .set({ sort_order: update.sort_order, updated_at: new Date() })
        .where(eq(lists.id, update.id));
    }
    return { success: true };
  }, {
    body: t.Array(t.Object({
      id: t.String(),
      sort_order: t.Number()
    }))
  })
  .get('/:id', async ({ params: { id } }) => {
    const list = await db.select().from(lists).where(eq(lists.id, id));
    if (!list.length) return { error: 'Not found' };
    return list[0];
  })
  .put('/:id', async ({ params: { id }, body }) => {
    const data = body as any;
    const [updatedList] = await db.update(lists)
      .set({ ...data, updated_at: new Date() })
      .where(eq(lists.id, id))
      .returning();
    return updatedList;
  })
  .delete('/:id', async ({ params: { id } }) => {
    await db.delete(lists).where(eq(lists.id, id));
    return { success: true };
  });
