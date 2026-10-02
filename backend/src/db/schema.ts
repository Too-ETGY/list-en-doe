import { pgTable, uuid, varchar, jsonb, timestamp, integer, real, date, primaryKey } from 'drizzle-orm/pg-core';
import { FieldDefinition } from '../types';

export const lists = pgTable('lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  template_type: varchar('template_type', { length: 50 }),
  field_definitions: jsonb('field_definitions').$type<FieldDefinition[]>().default([]).notNull(),
  status_options: jsonb('status_options').$type<string[]>().default([]).notNull(),
  sort_order: integer('sort_order').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  list_id: uuid('list_id').references(() => lists.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  status: varchar('status', { length: 100 }),
  priority: varchar('priority', { length: 20 }),
  image_url: varchar('image_url', { length: 1000 }),
  progress_current: real('progress_current'),
  progress_total: real('progress_total'),
  due_date: date('due_date'),
  custom_fields: jsonb('custom_fields').$type<Record<string, any>>().default({}).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  color: varchar('color', { length: 7 }).notNull(),
});

export const itemTags = pgTable('item_tags', {
  item_id: uuid('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  tag_id: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.item_id, t.tag_id] }),
}));
