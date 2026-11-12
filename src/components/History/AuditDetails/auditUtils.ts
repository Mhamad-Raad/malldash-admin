import {
  User,
  Package,
  Building2,
  Store,
  Home,
  FileText,
  Plus,
  PenLine,
  Trash2,
  Eye,
} from 'lucide-react';

export const getActionConfig = (action: string) => {
  const actionLower = action?.toLowerCase() || '';
  if (actionLower === 'created' || actionLower === 'create') {
    return {
      icon: Plus,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      bgColor: 'bg-emerald-500',
      label: 'Created',
    };
  }
  if (actionLower === 'updated' || actionLower === 'update') {
    return {
      icon: PenLine,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      bgColor: 'bg-blue-500',
      label: 'Updated',
    };
  }
  if (actionLower === 'deleted' || actionLower === 'delete') {
    return {
      icon: Trash2,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      bgColor: 'bg-red-500',
      label: 'Deleted',
    };
  }
  if (actionLower === 'viewed' || actionLower === 'view') {
    return {
      icon: Eye,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      bgColor: 'bg-purple-500',
      label: 'Viewed',
    };
  }
  return {
    icon: FileText,
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
    bgColor: 'bg-gray-500',
    label: action || 'Unknown',
  };
};

export const getEntityIcon = (entityName: string) => {
  const entityLower = entityName?.toLowerCase() || '';
  if (entityLower === 'user') return User;
  if (entityLower === 'product') return Package;
  if (entityLower === 'building') return Building2;
  if (entityLower === 'vendor') return Store;
  if (entityLower === 'apartment') return Home;
  return FileText;
};

export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

export const formatFieldName = (field: string): string => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const getEntityRoute = (entityName: string, entityId: string): string | null => {
  const entityLower = entityName?.toLowerCase();
  if (entityLower === 'user') return `/users/${entityId}`;
  if (entityLower === 'vendor') return `/vendors/${entityId}`;
  if (entityLower === 'product') return `/products/${entityId}`;
  if (entityLower === 'building') return `/buildings/${entityId}`;
  return null;
};
