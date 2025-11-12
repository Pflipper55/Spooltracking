import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SpoolService } from './api-clients/api/spool.service';
import { SpoolBrandService } from './api-clients/api/spoolBrand.service';
import { Spool } from './api-clients/model/spool';
import { SpoolBrand } from './api-clients/model/spoolBrand';
import { CreateSpoolModel } from './api-clients/model/createSpoolModel';
import { UpdateSpoolModel } from './api-clients/model/updateSpoolModel';
import { CreateSpoolBrandModel } from './api-clients/model/createSpoolBrandModel';
import { UpdateSpoolBrandModel } from './api-clients/model/updateSpoolBrandModel';

interface ApiConfig {
  apiHost: string;
  apiPort: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private spoolService: SpoolService;
  private spoolBrandService: SpoolBrandService;
  private apiBaseUrl: string = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) {
    this.loadConfig();
    this.spoolService = new SpoolService(this.httpClient, this.apiBaseUrl, undefined);
    this.spoolBrandService = new SpoolBrandService(this.httpClient, this.apiBaseUrl, undefined);
  }

  /**
   * Load API configuration from config.json
   */
  private async loadConfig(): Promise<void> {
    try {
      const config = await firstValueFrom(this.httpClient.get<ApiConfig>('config.json'));
      this.apiBaseUrl = `http://${config.apiHost}:${config.apiPort}`;
      // Update service base paths
      this.spoolService = new SpoolService(this.httpClient, this.apiBaseUrl, undefined);
      this.spoolBrandService = new SpoolBrandService(this.httpClient, this.apiBaseUrl, undefined);
    } catch (error) {
      console.warn('Could not load config.json, using default API URL', error);
      // Keep the default URL if config loading fails
    }
  }
  
  /**
   * Get all spools
   */
  async getAllSpools(): Promise<Spool[] | undefined> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolAllGet());
      return result;
    } catch (error) {
      console.error('Error fetching all spools:', error);
      throw error;
    }
  }

  /**
   * Get spool by ID
   */
  async getSpoolById(id: string): Promise<Spool | undefined> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolByIdIdGet(id));
      return result;
    } catch (error) {
      console.error('Error fetching spool by ID:', error);
      throw error;
    }
  }

  /**
   * Get spools by brand name
   */
  async getSpoolsByBrandName(name: string): Promise<Spool[] | undefined> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolByBrandNameNameGet(name));
      return result;
    } catch (error) {
      console.error('Error fetching spools by brand name:', error);
      throw error;
    }
  }

  /**
   * Get spools by color
   */
  async getSpoolsByColor(color: string): Promise<Spool[] | undefined> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolByColorColorGet(color));
      return result;
    } catch (error) {
      console.error('Error fetching spools by color:', error);
      throw error;
    }
  }

  /**
   * Get spools by material
   */
  async getSpoolsByMaterial(material: string): Promise<Spool[] | undefined> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolByMaterialMaterialGet(material));
      return result;
    } catch (error) {
      console.error('Error fetching spools by material:', error);
      throw error;
    }
  }

  /**
   * Create a new spool
   */
  async createSpool(model: CreateSpoolModel): Promise<any> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolCreatePost(model));
      return result;
    } catch (error) {
      console.error('Error creating spool:', error);
      throw error;
    }
  }

  /**
   * Update an existing spool
   */
  async updateSpool(model: UpdateSpoolModel): Promise<any> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolUpdatePost(model));
      return result;
    } catch (error) {
      console.error('Error updating spool:', error);
      throw error;
    }
  }

  /**
   * Delete a spool by ID
   */
  async deleteSpool(id: string): Promise<any> {
    try {
      const result = await firstValueFrom(this.spoolService.apiSpoolDeletePost(id));
      return result;
    } catch (error) {
      console.error('Error deleting spool:', error);
      throw error;
    }
  }

  // ============= SPOOL BRAND METHODS =============

  /**
   * Get all spool brands
   */
  async getAllBrands(): Promise<SpoolBrand[] | undefined> {
    try {
      const result = await firstValueFrom(this.spoolBrandService.apiSpoolbrandAllGet());
      return result;
    } catch (error) {
      console.error('Error fetching all brands:', error);
      throw error;
    }
  }

  /**
   * Get brand by name
   */
  async getBrandByName(name: string): Promise<SpoolBrand | undefined> {
    try {
      const result = await firstValueFrom(this.spoolBrandService.apiSpoolbrandByNameNameGet(name));
      return result;
    } catch (error) {
      console.error('Error fetching brand by name:', error);
      throw error;
    }
  }

  /**
   * Create a new brand
   */
  async createBrand(model: CreateSpoolBrandModel): Promise<any> {
    try {
      const result = await firstValueFrom(this.spoolBrandService.apiSpoolbrandCreatePost(model));
      return result;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }

  /**
   * Update an existing brand
   */
  async updateBrand(model: UpdateSpoolBrandModel): Promise<any> {
    try {
      const result = await firstValueFrom(this.spoolBrandService.apiSpoolbrandUpdatePost(model));
      return result;
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  }

  /**
   * Delete a brand by ID
   */
  async deleteBrand(id: string): Promise<any> {
    try {
      const result = await firstValueFrom(this.spoolBrandService.apiSpoolbrandDeletePost(id));
      return result;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }
}
