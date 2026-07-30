import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClubTableSetup, InventoryService } from '../inventory/inventory.service';

type TableType = 'Snooker' | 'Billiard';

@Component({
  selector: 'app-club-tables',
  standalone: false,
  templateUrl: './club-tables.component.html',
  styleUrl: './club-tables.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ClubTablesComponent implements OnInit {
  tables: ClubTableSetup[] = [];
  tableTypes: TableType[] = ['Snooker', 'Billiard'];
  isSaving = false;
  form = this.createEmptyForm();

  constructor(
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  saveTable(): void {
    if (!this.form.tableName.trim() || this.form.hourlyRate <= 0 || this.form.gameRate <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Table Setup',
        detail: 'Table name, per hour price, and per game price are required'
      });
      return;
    }

    this.isSaving = true;
    const request = this.form.clubTableId
      ? this.inventoryService.updateClubTable(this.form)
      : this.inventoryService.createClubTable(this.form);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'success',
          summary: this.form.clubTableId ? 'Table Updated' : 'Table Added',
          detail: this.form.clubTableId ? 'Table updated successfully' : 'Table added successfully'
        });
        this.resetForm();
        this.loadTables();
      },
      error: error => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Table Setup',
          detail: error?.error?.message || error?.message || 'Unable to save table'
        });
      }
    });
  }

  editTable(table: ClubTableSetup): void {
    this.form = {
      ...table,
      hourlyRate: Number(table.hourlyRate),
      minuteRate: Number(table.hourlyRate) / 60,
      gameRate: Number(table.gameRate)
    };
  }

  confirmDelete(table: ClubTableSetup): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${table.tableName}?`,
      header: 'Delete Table',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteTable(table)
    });
  }

  resetForm(): void {
    this.form = this.createEmptyForm();
  }

  private loadTables(): void {
    this.inventoryService.getClubTables().subscribe({
      next: tables => this.tables = tables.sort((a, b) => a.tableNo - b.tableNo),
      error: error => {
        this.tables = [];
        this.messageService.add({
          severity: 'error',
          summary: 'Table Setup',
          detail: error?.error?.message || error?.message || 'Unable to load tables'
        });
      }
    });
  }

  private deleteTable(table: ClubTableSetup): void {
    this.inventoryService.deleteClubTable(table.clubTableId || table.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Table Deleted',
          detail: 'Table deleted successfully'
        });
        this.loadTables();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Table',
          detail: error?.error?.message || error?.message || 'Unable to delete table'
        });
      }
    });
  }

  private createEmptyForm(): ClubTableSetup {
    return {
      id: 0,
      clubTableId: 0,
      tableNo: this.tables.length + 1,
      tableName: '',
      tableType: 'Snooker',
      hourlyRate: 30,
      minuteRate: 0.5,
      gameRate: 15,
      isActive: true
    };
  }
}
