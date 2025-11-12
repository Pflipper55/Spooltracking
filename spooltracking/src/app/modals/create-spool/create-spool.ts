import { Component, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ApiService } from '../../services/api-service';
import { SpoolBrand } from '../../services/api-clients/model/spoolBrand';
import { CreateSpoolModel } from '../../services/api-clients/model/createSpoolModel';

@Component({
  selector: 'app-create-spool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
  ],
  templateUrl: './create-spool.html',
  styleUrl: './create-spool.css',
})
export class CreateSpool implements OnInit {
  visible: boolean = false;
  brands: SpoolBrand[] = [];
  loading: boolean = false;
  error: string | null = null;

  spoolAdded = output<void>();

  formData: CreateSpoolModel = {
    brandId: undefined,
    material: '',
    color: '',
    weight: undefined,
  };

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
    this.resetForm();
  }

  hideDialog(): void {
    this.visible = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      brandId: undefined,
      material: '',
      color: '',
      weight: undefined,
    };
    this.error = null;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      await this.apiService.createSpool(this.formData);
      this.spoolAdded.emit();
      this.visible = false;
      this.resetForm();
    } catch (err) {
      this.error =
        err instanceof Error
          ? err.message
          : 'Error creating spool. Please try again.';
      console.error('Error creating spool:', err);
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
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
