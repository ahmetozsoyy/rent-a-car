import api from './api';
import { IVehicle } from '../types/vehicle';

export const vehicleService = {
  getAllVehicles: async (): Promise<IVehicle[]> => {
    const response = await api.get<IVehicle[]>('/vehicles');
    return response.data;
  },

  getVehicleById: async (id: string): Promise<IVehicle> => {
    const response = await api.get<IVehicle>(`/vehicles/${id}`);
    return response.data;
  }
};
