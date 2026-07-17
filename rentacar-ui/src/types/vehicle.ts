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
  imageUrl?: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  minDriverAge: number;
}
