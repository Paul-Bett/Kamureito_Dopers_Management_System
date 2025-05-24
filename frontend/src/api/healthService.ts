import apiClient from './client';

export interface HealthEvent {
  id: number;
  sheep_id: string;
  event_date: string;
  event_type: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details: string;
  next_due_date?: string;
  attachments?: string[];
}

export interface HealthEventCreate {
  sheep_id: string;
  event_date: string;
  event_type: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details: string;
  next_due_date?: string;
  attachments?: string[];
}

export interface HealthEventUpdate {
  event_date?: string;
  event_type?: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details?: string;
  next_due_date?: string;
  attachments?: string[];
}

export interface HealthEventFilter {
  sheep_id?: string;
  event_type?: 'vaccination' | 'treatment' | 'checkup' | 'other';
  start_date?: string;
  end_date?: string;
  overdue?: boolean;
}

class HealthService {
  async createHealthEvent(event: HealthEventCreate): Promise<HealthEvent> {
    const response = await apiClient.post('/health/', event);
    return response.data;
  }

  async getHealthEvent(id: number): Promise<HealthEvent> {
    const response = await apiClient.get(`/health/${id}`);
    return response.data;
  }

  async updateHealthEvent(id: number, event: HealthEventUpdate): Promise<HealthEvent> {
    const response = await apiClient.put(`/health/${id}`, event);
    return response.data;
  }

  async deleteHealthEvent(id: number): Promise<void> {
    await apiClient.delete(`/health/${id}`);
  }

  async listHealthEvents(filters?: HealthEventFilter): Promise<HealthEvent[]> {
    const response = await apiClient.get('/health/', { params: filters });
    return response.data;
  }
}

export const healthService = new HealthService(); 