export interface HomeInput {
  name: string;
  orientation: "North" | "South" | "East" | "West";
  latlng: { lat: number; lng: number };
  dailyConsumption: number;
  panelSize?: number; 
}

export interface HomeResult extends HomeInput {
  production: number;      
  netEnergy: number;         
  role: "served" | "under-supplied";
  isSolarHub?: boolean;
}
