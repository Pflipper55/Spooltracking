import { Component, OnInit } from '@angular/core';
import { Spool, SpoolBrand } from '../services/api-clients';
import { ApiService } from '../services/api-service';
import { CardModule } from 'primeng/card';
import { colorNameToCode } from 'color-name-to-code';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';


@Component({
  selector: 'app-spools',
  imports: [CommonModule,CardModule, Menu],
  templateUrl: './spools.html',
  styleUrl: './spools.css',
  standalone: true,
})
export class SpoolsComponent implements OnInit {
  menuItems: MenuItem[] = [];

  spools: Spool[] = [];
  brands: SpoolBrand[] = [];
  error: string | null = null;

  constructor(private apiService: ApiService) {
    this.menuItems = [
      { 
        label: 'Spools',
        items: [
          { label: 'Add Spool', icon: 'pi pi-fw pi-plus' },
          { label: 'Edit Spool', icon: 'pi pi-fw pi-pencil' },
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
}
