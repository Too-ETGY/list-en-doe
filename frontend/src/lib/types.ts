export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'url' | 'image' | 'select' | 'multi_select' | 'checkbox' | 'progress';
  required?: boolean;
  options?: string[];
  auto_fill_key?: string;
}

export interface List {
  id: string;
  name: string;
  icon: string;
  template_type: string | null;
  field_definitions: FieldDefinition[];
  status_options: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Item {
  id: string;
  list_id: string;
  title: string;
  status: string | null;
  priority: 'high' | 'medium' | 'low' | null;
  image_url: string | null;
  progress_current: number | null;
  progress_total: number | null;
  due_date: string | null;
  custom_fields: Record<string, any>;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}
