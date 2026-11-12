export type TicketStatus = 0 | 1 | 2 | 3;

export type TicketPriority = 0 | 1 | 2 | 3;

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  resolvedAt?: string | null;
  userName?: string;
}

export interface SupportTicketsResponse {
  data: SupportTicket[];
  page: number;
  limit: number;
  total: number;
}

export const TICKET_STATUS_OPTIONS: {
  value: TicketStatus | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'All statuses' },
  { value: 0, label: 'Open' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Resolved' },
  { value: 3, label: 'Closed' },
];

export const TICKET_PRIORITY_OPTIONS: {
  value: TicketPriority;
  label: string;
}[] = [
  { value: 0, label: 'Low' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Urgent' },
];
