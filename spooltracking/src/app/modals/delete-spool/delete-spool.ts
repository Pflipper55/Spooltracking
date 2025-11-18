import { Component, input, output } from '@angular/core';
import { SpoolBrand, Spool } from '../../services/api-clients';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-delete-spool',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, ListboxModule],
  templateUrl: './delete-spool.html',
  styleUrl: './delete-spool.css',
})
export class DeleteSpool {
  visible: boolean = false;
  allSpools = input<Spool[]>([]);
  loading: boolean = false;
  error: string | null = null;
  selectedSpool: Spool | null = null;
  spoolSelectionStep: boolean = true;

  spoolDeleted = output<void>();
  selectedSpoolId: string | undefined = undefined;

  constructor(private apiService: ApiService) {}

  showDialog(): void {
    this.visible = true;
    this.spoolSelectionStep = true;
    this.selectedSpool = null;
  }

  showDialogWithSpool(s: Spool): void {
    this.visible = true;
    this.onSpoolSelected(s);
  }

  hideDialog(): void {
    this.visible = false;
    this.spoolSelectionStep = true;
    this.selectedSpool = null;
  }

  onSpoolSelected(spool: Spool): void {
    this.selectedSpool = spool;
    this.selectedSpoolId = spool.id;
    this.spoolSelectionStep = false;
    this.error = null;
  }

  goBackToSelection(): void {
    this.spoolSelectionStep = true;
    this.selectedSpool = null;
    this.selectedSpoolId = undefined;
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
    this.loading = true;
    this.error = null;

    try {
      await this.apiService.deleteSpool(this.selectedSpoolId!);
      this.spoolDeleted.emit();
      this.visible = false;
      this.spoolSelectionStep = true;
      this.selectedSpool = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error removing spool. Please try again.';
      console.error('Error updating spool:', err);
    } finally {
      this.loading = false;
    }
  }
}
