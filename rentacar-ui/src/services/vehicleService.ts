import api from './api';
import type { IVehicle } from '../types/vehicle';

export const vehicleService = {
  getAllVehicles: async (): Promise<IVehicle[]> => {
    const response = await api.get<IVehicle[]>('/vehicles');
    return response.data;
  },

  getAvailableVehicles: async (startDate: string, endDate: string): Promise<IVehicle[]> => {
    const response = await api.get<IVehicle[]>(`/vehicles/available?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getVehicleById: async (id: string): Promise<IVehicle> => {
    const response = await api.get<IVehicle>(`/vehicles/${id}`);
    return response.data;
  }
};
