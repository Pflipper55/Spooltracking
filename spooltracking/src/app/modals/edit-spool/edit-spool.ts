import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ApiService } from '../../services/api-service';
import { Spool, SpoolBrand } from '../../services/api-clients';
import { UpdateSpoolModel } from '../../services/api-clients/model/updateSpoolModel';

@Component({
  selector: 'app-edit-spool',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './edit-spool.html',
  styleUrl: './edit-spool.css',
})
export class EditSpool implements OnInit {
  visible: boolean = false;
  brands: SpoolBrand[] = [];
  allSpools = input<Spool[]>([]);
  loading: boolean = false;
  error: string | null = null;
  selectedSpool: Spool | null = null;
  spoolSelectionStep: boolean = true;

  spoolEdited = output<void>();

  formData: UpdateSpoolModel = {
    id: undefined,
    brandId: undefined,
    material: '',
    color: '',
    weight: undefined,
  };

  selectedSpoolId: string | undefined = undefined;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  async loadBrands(): Promise<void> {
    try {
      const result = await this.apiService.getAllBrands();
      this.brands = result || [];
    } catch (err) {
      console.error('Error loading brands:', err);
      this.brands = [];
    }
  }

  showDialog(): void {
    this.visible = true;
    this.spoolSelectionStep = true;
    this.selectedSpool = null;
    this.resetForm();
  }

  showDialogWithSpool(s: Spool): void {
    this.visible = true;
    this.onSpoolSelected(s);
  }

  hideDialog(): void {
    this.visible = false;
    this.spoolSelectionStep = true;
    this.selectedSpool = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      id: undefined,
      brandId: undefined,
      material: '',
      color: '',
      weight: undefined,
    };
    this.error = null;
  }

  onSpoolSelected(spool: Spool): void {
    this.selectedSpool = spool;
    this.formData = {
      id: spool.id,
      brandId: spool.brandId,
      material: spool.material || '',
      color: spool.color || '',
      weight: spool.weight,
    };
    this.spoolSelectionStep = false;
    this.error = null;
  }

  goBackToSelection(): void {
    this.spoolSelectionStep = true;
    this.selectedSpool = null;
    this.selectedSpoolId = undefined;
    this.resetForm();
  }

  getSelectedSpoolId(): string | undefined {
    return this.selectedSpoolId;
  }

  onSelectButtonClick(): void {
    const spool = this.allSpools().find(s => s.id === this.selectedSpoolId);
    if (spool) {
      this.onSpoolSelected(spool);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      await this.apiService.updateSpool(this.formData);
      this.spoolEdited.emit();
      this.visible = false;
      this.spoolSelectionStep = true;
      this.selectedSpool = null;
      this.resetForm();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error updating spool. Please try again.';
      console.error('Error updating spool:', err);
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.formData.id) {
      this.error = 'No spool selected.';
      return false;
    }

    if (!this.formData.brandId) {
      this.error = 'Please select a brand.';
      return false;
    }

    if (this.formData.weight === undefined || this.formData.weight === null) {
      this.error = 'Please enter a weight.';
      return false;
    }

    if (this.formData.weight <= 0) {
      this.error = 'Weight must be greater than 0.';
      return false;
    }

    return true;
  }
}
