/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IIterator } from './iterator';
import { Product, ShipmentPackage, OptimizationResult, ShipmentConfig } from '../types';

export class ShipmentAggregator {
  private iterator: IIterator<Product>;
  private config: ShipmentConfig;

  constructor(iterator: IIterator<Product>, config: ShipmentConfig) {
    this.iterator = iterator;
    this.config = config;
  }

  optimize(): OptimizationResult {
    this.iterator.reset();
    const packages: ShipmentPackage[] = [];
    let currentPackage: ShipmentPackage = this.createNewPackage();

    while (this.iterator.hasNext()) {
      const product = this.iterator.next();
      if (!product) break;

      // Check if adding this product exceeds limits
      const wouldExceedWeight = currentPackage.totalWeight + product.weight > this.config.maxWeightPerPackage;
      const wouldExceedVolume = currentPackage.totalVolume + product.volume > this.config.maxVolumePerPackage;

      if ((wouldExceedWeight || wouldExceedVolume) && currentPackage.products.length > 0) {
        // Finalize current package and start a new one
        currentPackage.cost = this.calculatePackageCost(currentPackage);
        packages.push(currentPackage);
        currentPackage = this.createNewPackage();
      }

      // Add product to (possibly new) current package
      currentPackage.products.push(product);
      currentPackage.totalWeight += product.weight;
      currentPackage.totalVolume += product.volume;
    }

    // Don't forget the last package
    if (currentPackage.products.length > 0) {
      currentPackage.cost = this.calculatePackageCost(currentPackage);
      packages.push(currentPackage);
    }

    const totalCost = packages.reduce((sum, pkg) => sum + pkg.cost, 0);

    return {
      packages,
      totalCost,
    };
  }

  private createNewPackage(): ShipmentPackage {
    return {
      products: [],
      totalWeight: 0,
      totalVolume: 0,
      cost: 0,
    };
  }

  private calculatePackageCost(pkg: ShipmentPackage): number {
    let cost = this.config.baseCost;

    // Shipping method surcharge
    if (this.config.shippingMethod === 'fast') {
      cost += this.config.fastShippingSurcharge;
    }

    // Distance surcharge (applied per shipment)
    if (this.config.distance > this.config.baseDistance) {
      const extraKm = this.config.distance - this.config.baseDistance;
      cost += extraKm * this.config.extraKmRate;
    }

    // Weight surcharge (if we strictly exceeded and allowed it, but aggregator tries to avoid)
    // The requirement says aggregator starts a new one to minimize this, 
    // but we can keep it as a fallback calculation if a single item exceeds 30kg.
    if (pkg.totalWeight > this.config.maxWeightPerPackage) {
      const extraKg = pkg.totalWeight - this.config.maxWeightPerPackage;
      cost += extraKg * this.config.extraKgRate;
    }

    return cost;
  }
}
