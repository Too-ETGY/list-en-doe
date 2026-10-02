import { Elysia, t } from 'elysia';
import { db } from '../db/connection';
import { tags, itemTags } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const tagsRoutes = new Elysia()
  .get('/tags', async () => {
    return await db.select().from(tags);
  })
  .post('/tags', async ({ body }) => {
    const data = body as { name: string; color: string };
    const [newTag] = await db.insert(tags).values({
      name: data.name,
      color: data.color
    }).returning();
    return newTag;
  }, {
    body: t.Object({
      name: t.String(),
      color: t.String()
    })
  })
  .delete('/tags/:id', async ({ params: { id } }) => {
    await db.delete(tags).where(eq(tags.id, id));
    return { success: true };
  })
  .post('/items/:id/tags', async ({ params: { id: itemId }, body }) => {
    const data = body as { tag_id: string };
    const [newItemTag] = await db.insert(itemTags).values({
      item_id: itemId,
      tag_id: data.tag_id
    }).returning();
    return newItemTag;
  }, {
    body: t.Object({
      tag_id: t.String()
    })
  })
  .delete('/items/:id/tags/:tagId', async ({ params: { id: itemId, tagId } }) => {
    await db.delete(itemTags).where(and(eq(itemTags.item_id, itemId), eq(itemTags.tag_id, tagId)));
    return { success: true };
  });
