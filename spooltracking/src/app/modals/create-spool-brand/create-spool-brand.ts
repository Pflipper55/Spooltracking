import { Component, output } from '@angular/core';
import { SpoolBrand, CreateSpoolBrandModel } from '../../services/api-clients';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-create-spool-brand',
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
  templateUrl: './create-spool-brand.html',
  styleUrl: './create-spool-brand.css',
})
export class CreateSpoolBrand {
  visible: boolean = false;
  brands: SpoolBrand[] = [];
  loading: boolean = false;
  error: string | null = null;

  spoolBrandAdded = output<void>();

  formData: CreateSpoolBrandModel = {
    name: '',
  };

  constructor(private apiService: ApiService) {}


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
      name: '',
    };
    this.error = null;
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      await this.apiService.createBrand(this.formData);
      this.spoolBrandAdded.emit();
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
}
