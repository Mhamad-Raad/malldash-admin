export interface AuditLog {
  id: number | string;
  userId: string;
  userEmail: string;
  profileImageUrl?: string;
  entityName: string;
  entityId: string;
  action: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  affectedColumns?: string[];
  timestamp: string;
  ipAddress?: string | null;
  userAgent?: string;
  [key: string]: any;
}

