import { Component, OnInit } from '@angular/core';
import { InventoryItem, InventoryService } from './inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  items: InventoryItem[] = [];
  itemName = '';
  category = 'Drink';
  price: number = 0;
  stock: number = 0;
  editingItem: InventoryItem | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  addItem(): void {
    if (!this.itemName || this.price <= 0 || this.stock < 0) {
      return;
    }

    if (this.editingItem) {
      this.inventoryService.updateItem({
        ...this.editingItem,
        name: this.itemName.trim(),
        category: (this.category || 'Drink').trim(),
        price: this.price,
        stock: this.stock,
        stockQty: this.stock
      }).subscribe(() => this.resetFormAndReload());

      return;
    }

    const existingItem = this.items.find(item =>
      this.normalize(item.name) === this.normalize(this.itemName) &&
      this.normalize(item.category) === this.normalize(this.category || 'Drink')
    );

    if (existingItem) {
      this.inventoryService.updateItem({
        ...existingItem,
        name: this.itemName.trim(),
        category: (this.category || 'Drink').trim(),
        price: this.price,
        stock: existingItem.stock + this.stock,
        stockQty: existingItem.stock + this.stock
      }).subscribe(() => this.resetFormAndReload());

      return;
    }

    this.inventoryService.addItem({
      name: this.itemName.trim(),
      category: (this.category || 'Drink').trim(),
      price: this.price,
      stock: this.stock
    }).subscribe(() => this.resetFormAndReload());
  }

  editItem(item: InventoryItem): void {
    this.editingItem = item;
    this.itemName = item.name;
    this.category = item.category;
    this.price = item.price;
    this.stock = item.stock;
  }

  deleteItem(item: InventoryItem): void {
    const itemId = item.inventoryItemId || item.id;

    if (!itemId) {
      return;
    }

    this.inventoryService.deleteItem(itemId).subscribe(() => {
      if (this.editingItem?.id === item.id) {
        this.clearForm();
      }

      this.loadItems();
    });
  }

  clearForm(): void {
    this.editingItem = null;
    this.itemName = '';
    this.category = 'Drink';
    this.price = 0;
    this.stock = 0;
  }

  private loadItems(): void {
    this.inventoryService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  private resetFormAndReload(): void {
    this.loadItems();
    this.clearForm();
  }

  private normalize(value: string): string {
    return (value || '').trim().toLowerCase();
  }
}
