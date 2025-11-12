import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api-service';
import { Spool } from '../services/api-clients/model/spool';
import { SpoolBrand } from '../services/api-clients/model/spoolBrand';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { colorNameToCode } from 'color-name-to-code';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  spools: Spool[] = [];
  brands: SpoolBrand[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
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
    } finally {
      this.loading = false;
    }
  }

  getBrandName(brandId: string | undefined): string {
    if (!brandId) return 'Unknown';
    const brand = this.brands.find((b) => b.id === brandId);
    return brand?.name || 'Unknown';
  }

  getSpoolCount(): number {
    return this.spools.length;
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
