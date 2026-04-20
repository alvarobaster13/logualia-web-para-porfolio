/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  weight: number; // kg
  dimensions: string; // e.g., "180x85x66cm"
  volume: number; // m3
}

export interface ShipmentPackage {
  products: Product[];
  totalWeight: number;
  totalVolume: number;
  cost: number;
}

export interface OptimizationResult {
  packages: ShipmentPackage[];
  totalCost: number;
}

export interface ShipmentConfig {
  distance: number;
  baseCost: number;
  maxWeightPerPackage: number;
  maxVolumePerPackage: number;
  extraKmRate: number;
  baseDistance: number;
  extraKgRate: number;
  shippingMethod: 'normal' | 'fast';
  fastShippingSurcharge: number;
}
