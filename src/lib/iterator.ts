/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IIterator<T> {
  hasNext(): boolean;
  next(): T | null;
  hasPrevious(): boolean;
  previous(): T | null;
  current(): T | null;
  reset(): void;
  setIndex(index: number): void;
  getIndex(): number;
  getCount(): number;
}

export class ProductIterator<T> implements IIterator<T> {
  private items: T[];
  private position: number = -1;

  constructor(items: T[]) {
    this.items = items;
  }

  hasNext(): boolean {
    return this.position < this.items.length - 1;
  }

  next(): T | null {
    if (this.hasNext()) {
      this.position++;
      return this.items[this.position];
    }
    return null;
  }

  hasPrevious(): boolean {
    return this.position > 0;
  }

  previous(): T | null {
    if (this.hasPrevious()) {
      this.position--;
      return this.items[this.position];
    }
    return null;
  }

  current(): T | null {
    if (this.position >= 0 && this.position < this.items.length) {
      return this.items[this.position];
    }
    return null;
  }

  reset(): void {
    this.position = -1;
  }

  setIndex(index: number): void {
    if (index >= -1 && index < this.items.length) {
      this.position = index;
    }
  }

  getIndex(): number {
    return this.position;
  }

  getCount(): number {
    return this.items.length;
  }
}
