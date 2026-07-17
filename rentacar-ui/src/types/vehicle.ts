export enum VehicleSegment {
  Economy = 1,
  Compact = 2,
  Standard = 3,
  Premium = 4,
  Luxury = 5,
  SUV = 6
}

export interface IVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  segment: VehicleSegment;
  dailyPrice: number;
  currentLocationId: string;
  // UI için ekstra gösterim alanları (örneğin image URL) backend'de yoksa frontend'de mocklanabilir veya ileride eklenebilir.
  imageUrl?: string;
  transmission?: 'Auto' | 'Manual'; // Opsiyonel özellikler
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
}
