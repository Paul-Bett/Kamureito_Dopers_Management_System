import apiClient from './client';
import type { Sheep } from './sheepService';

export interface MatingPair {
  id: number;
  ramId: number;
  eweId: number;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  ram?: Sheep;
  ewe?: Sheep;
}

class MatingService {
  async getAllMatingPairs(): Promise<MatingPair[]> {
    const response = await apiClient.get<MatingPair[]>('/mating-pairs');
    return response.data;
  }

  async getMatingPair(id: number): Promise<MatingPair> {
    const response = await apiClient.get<MatingPair>(`/mating-pairs/${id}`);
    return response.data;
  }

  async createMatingPair(data: Omit<MatingPair, 'id'>): Promise<MatingPair> {
    const response = await apiClient.post<MatingPair>('/mating-pairs', data);
    return response.data;
  }

  async updateMatingPair(id: number, data: Partial<MatingPair>): Promise<MatingPair> {
    const response = await apiClient.put<MatingPair>(`/mating-pairs/${id}`, data);
    return response.data;
  }

  async deleteMatingPair(id: number): Promise<void> {
    await apiClient.delete(`/mating-pairs/${id}`);
  }

  async getAvailableRams(): Promise<Sheep[]> {
    const response = await apiClient.get<Sheep[]>('/sheep/available-rams');
    return response.data;
  }

  async getAvailableEwes(): Promise<Sheep[]> {
    const response = await apiClient.get<Sheep[]>('/sheep/available-ewes');
    return response.data;
  }
}

export const matingService = new MatingService(); 