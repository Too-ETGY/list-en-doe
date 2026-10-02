export interface FieldDefinition {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'url';
  label: string;
}

export interface List {
  id: string;
  name: string;
  icon: string;
  template_type: string | null;
  field_definitions: FieldDefinition[];
  status_options: string[];
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Item {
  id: string;
  list_id: string;
  title: string;
  status: string | null;
  priority: string | null;
  image_url: string | null;
  progress_current: number | null;
  progress_total: number | null;
  due_date: Date | null;
  custom_fields: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface AutoFillResult {
  title: string;
  image_url?: string;
  custom_fields?: Record<string, any>;
}

export interface CreateListInput {
  name: string;
  icon: string;
  template_type?: string;
}

export interface CreateItemInput {
  title: string;
  status?: string;
  priority?: string;
  image_url?: string;
  progress_current?: number;
  progress_total?: number;
  due_date?: string;
  custom_fields?: Record<string, any>;
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
}
