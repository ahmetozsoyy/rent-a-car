import api from './api';
import type { IVehicle } from '../types/vehicle';

export const vehicleService = {
  getAllVehicles: async (): Promise<IVehicle[]> => {
    const response = await api.get<IVehicle[]>('/vehicles');
    return response.data;
  },

  getAvailableVehicles: async (pickupLocationId: string, startDate: string, endDate: string): Promise<IVehicle[]> => {
    const utcStartDate = encodeURIComponent(new Date(startDate).toISOString());
    const utcEndDate = encodeURIComponent(new Date(endDate).toISOString());
    const response = await api.get<IVehicle[]>(`/vehicles/available?pickupLocationId=${pickupLocationId}&startDate=${utcStartDate}&endDate=${utcEndDate}`);
    return response.data;
  },

  getVehicleById: async (id: string): Promise<IVehicle> => {
    const response = await api.get<IVehicle>(`/vehicles/${id}`);
    return response.data;
  }
};
