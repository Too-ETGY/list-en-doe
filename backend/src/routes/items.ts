import { Elysia, t } from 'elysia';
import { db } from '../db/connection';
import { items, itemTags, tags } from '../db/schema';
import { eq, and, ilike, inArray, asc, desc, sql } from 'drizzle-orm';

export const itemsRoutes = new Elysia()
  .get('/lists/:id/items', async ({ params: { id: listId }, query }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const offset = (page - 1) * limit;

    let orderClause = asc(items.created_at);
    if (query.sort) {
      const isDesc = query.order === 'desc';
      const colName = query.sort as keyof typeof items._.columns;
      if (items[colName]) {
        orderClause = isDesc ? desc(items[colName]) : asc(items[colName]);
      }
    }

    const conditions = [eq(items.list_id, listId)];
    
    if (query.status) conditions.push(eq(items.status, query.status));
    if (query.priority) conditions.push(eq(items.priority, query.priority));
    if (query.search) conditions.push(ilike(items.title, `%${query.search}%`));

    if (query.tags) {
      const tagList = query.tags.split(',');
      const tagSubquery = db.select({ item_id: itemTags.item_id })
        .from(itemTags)
        .innerJoin(tags, eq(itemTags.tag_id, tags.id))
        .where(inArray(tags.name, tagList))
        .groupBy(itemTags.item_id)
        .having(sql`count(distinct ${tags.id}) = ${tagList.length}`);
      
      conditions.push(inArray(items.id, tagSubquery));
    }

    const results = await db.select()
      .from(items)
      .where(and(...conditions))
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return results;
  })
  .post('/lists/:id/items', async ({ params: { id: listId }, body }) => {
    const data = body as any;
    const [newItem] = await db.insert(items).values({
      list_id: listId,
      title: data.title,
      status: data.status,
      priority: data.priority,
      image_url: data.image_url,
      progress_current: data.progress_current,
      progress_total: data.progress_total,
      due_date: data.due_date,
      custom_fields: data.custom_fields || {},
    }).returning();
    return newItem;
  })
  .put('/items/:id', async ({ params: { id }, body }) => {
    const data = body as any;
    const [updatedItem] = await db.update(items)
      .set({ ...data, updated_at: new Date() })
      .where(eq(items.id, id))
      .returning();
    return updatedItem;
  })
  .delete('/items/:id', async ({ params: { id } }) => {
    await db.delete(items).where(eq(items.id, id));
    return { success: true };
  })
  .patch('/items/:id/status', async ({ params: { id }, body }) => {
    const data = body as { status: string };
    const [updatedItem] = await db.update(items)
      .set({ status: data.status, updated_at: new Date() })
      .where(eq(items.id, id))
      .returning();
    return updatedItem;
  }, {
    body: t.Object({
      status: t.String()
    })
  })
  .patch('/items/:id/progress', async ({ params: { id }, body }) => {
    const data = body as { progress_current: number; progress_total?: number };
    const [updatedItem] = await db.update(items)
      .set({ 
        progress_current: data.progress_current, 
        progress_total: data.progress_total,
        updated_at: new Date() 
      })
      .where(eq(items.id, id))
      .returning();
    return updatedItem;
  }, {
    body: t.Object({
      progress_current: t.Number(),
      progress_total: t.Optional(t.Number())
    })
  });
