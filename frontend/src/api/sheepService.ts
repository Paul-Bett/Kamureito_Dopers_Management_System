import apiClient from './client';

export interface Sheep {
  id: number;
  tag_id: string;
  scrapie_id?: string;
  breed: string;
  sex: 'male' | 'female';
  date_of_birth: string;
  purchase_date?: string;
  acquisition_price?: number;
  origin_farm?: string;
  rfid_code?: string;
  qr_code?: string;
  status: 'active' | 'sold' | 'deceased';
  current_section: 'male' | 'general' | 'mating';
  sale_date?: string;
  sale_price?: number;
  death_date?: string;
  sire_id?: string;
  dam_id?: string;
  notes?: string;
}

export interface HealthEvent {
  id: number;
  sheepId: number;
  eventType: string;
  date: string;
  status: 'active' | 'resolved';
  description: string;
}

export interface MatingPair {
  id: number;
  maleSheepId: number;
  femaleSheepId: number;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  expectedLambingDate?: string;
}

export const sheepService = {
  // Sheep management
  getAllSheep: () => apiClient.get<Sheep[]>('/sheep'),
  getSheepById: (id: number) => apiClient.get<Sheep>(`/sheep/${id}`),
  createSheep: (sheep: Omit<Sheep, 'id'>) => apiClient.post<Sheep>('/sheep', sheep),
  updateSheep: (id: number, sheep: Partial<Sheep>) => apiClient.put<Sheep>(`/sheep/${id}`, sheep),
  deleteSheep: (id: number) => apiClient.delete(`/sheep/${id}`),

  // Health events
  getHealthEvents: () => apiClient.get<HealthEvent[]>('/health-events'),
  createHealthEvent: (event: Omit<HealthEvent, 'id'>) => apiClient.post<HealthEvent>('/health-events', event),
  updateHealthEvent: (id: number, event: Partial<HealthEvent>) => apiClient.put<HealthEvent>(`/health-events/${id}`, event),

  // Mating pairs
  getMatingPairs: () => apiClient.get<MatingPair[]>('/mating-pairs'),
  createMatingPair: (pair: Omit<MatingPair, 'id'>) => apiClient.post<MatingPair>('/mating-pairs', pair),
  updateMatingPair: (id: number, pair: Partial<MatingPair>) => apiClient.put<MatingPair>(`/mating-pairs/${id}`, pair),
}; 