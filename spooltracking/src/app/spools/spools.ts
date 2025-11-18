import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Spool, SpoolBrand } from '../services/api-clients';
import { ApiService } from '../services/api-service';
import { CardModule } from 'primeng/card';
import { colorNameToCode } from 'color-name-to-code';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CreateSpool } from '../modals/create-spool/create-spool';
import { EditSpool } from '../modals/edit-spool/edit-spool';

@Component({
  selector: 'app-spools',
  imports: [CommonModule, CardModule, Menu, ButtonModule, ProgressSpinnerModule, CreateSpool, EditSpool],
  templateUrl: './spools.html',
  styleUrl: './spools.css',
  standalone: true,
})
export class SpoolsComponent implements OnInit {
  @ViewChild(CreateSpool) createSpoolModal!: CreateSpool;
  @ViewChild(EditSpool) editSpoolModal!: EditSpool;
  
  menuItems: MenuItem[] = [];
  isLoading: boolean = false;

  spools: Spool[] = [];
  brands: SpoolBrand[] = [];
  error: string | null = null;

  constructor(private apiService: ApiService) {
    this.menuItems = [
      { 
        label: 'Spools',
        items: [
          { label: 'Add Spool', icon: 'pi pi-fw pi-plus', command: () => this.onOpenCreateSpool() },
          { label: 'Edit Spool', icon: 'pi pi-fw pi-pencil', command: () => this.onOpenEditSpool() },
          { label: 'Remove Spool', icon: 'pi pi-fw pi-trash' },
        ]
      },
      {
        label: 'Brands',
        items: [
          { label: 'Add Brand', icon: 'pi pi-fw pi-plus' },
          { label: 'Edit Brand', icon: 'pi pi-fw pi-pencil' },
          { label: 'Remove Brand', icon: 'pi pi-fw pi-trash' },
        ]
      }
    ];
  }
  
  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.error = null;

      // Paralleles Laden von Spools und Brands
      const [spools, brands] = await Promise.all([
        this.apiService.getAllSpools(),
        this.apiService.getAllBrands(),
      ]);

      this.spools = spools || [];
      this.brands = brands || [];
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : 'Error loading data from server';
      console.error('Failed to load dashboard data:', err);
    }
  }

  getColorCode(colorName: string | null | undefined): string {
    if (!colorName) return '#cccccc'; // Grau als Fallback
    try {
      const code = colorNameToCode(colorName);
      return code || '#cccccc';
    } catch {
      return '#cccccc';
    }
  }

  onOpenCreateSpool(): void {
    this.createSpoolModal.showDialog();
  }

  onOpenEditSpool(): void {
    this.editSpoolModal.showDialog();
  }

  openEditSpoolModalFromCard(spool: Spool): void {
    this.editSpoolModal.showDialogWithSpool(spool);
  }

  confirmDeleteSpool(_t12: Spool) {
    throw new Error('Method not implemented.');
  }
}

