import axios from 'axios';

export interface HealthEvent {
  id: number;
  sheep_id: string;
  event_date: string;
  event_type: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details: string;
  next_due_date?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface HealthEventCreate {
  sheep_id: string;
  event_date: string;
  event_type: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details: string;
  next_due_date?: string;
  attachments: File[];
}

export interface HealthEventUpdate {
  event_date?: string;
  event_type?: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details?: string;
  next_due_date?: string;
  attachments?: File[];
}

export interface HealthEventFilter {
  sheep_id?: string;
  event_type?: 'vaccination' | 'treatment' | 'checkup' | 'other';
  start_date?: string;
  end_date?: string;
  overdue?: boolean;
}

class HealthService {
  private baseUrl = '/api/v1/health';

  async createHealthEvent(event: HealthEventCreate): Promise<HealthEvent> {
    const formData = new FormData();
    formData.append('sheep_id', event.sheep_id);
    formData.append('event_date', event.event_date);
    formData.append('event_type', event.event_type);
    formData.append('details', event.details);
    if (event.next_due_date) {
      formData.append('next_due_date', event.next_due_date);
    }
    event.attachments.forEach((file, index) => {
      formData.append(`attachments`, file);
    });

    const response = await axios.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getHealthEvent(id: number): Promise<HealthEvent> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateHealthEvent(id: number, event: HealthEventUpdate): Promise<HealthEvent> {
    const formData = new FormData();
    if (event.event_date) formData.append('event_date', event.event_date);
    if (event.event_type) formData.append('event_type', event.event_type);
    if (event.details) formData.append('details', event.details);
    if (event.next_due_date) formData.append('next_due_date', event.next_due_date);
    if (event.attachments) {
      event.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await axios.put(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async deleteHealthEvent(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async listHealthEvents(filters?: HealthEventFilter): Promise<HealthEvent[]> {
    const response = await axios.get(this.baseUrl, { params: filters });
    return response.data;
  }
}

export const healthService = new HealthService(); 