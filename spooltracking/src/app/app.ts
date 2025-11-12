import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnInit {
  ngOnInit(): void {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home' ,routerLink: '/dashboard' },
      { label: 'Spools', icon: 'pi pi-warehouse' ,routerLink: '/spools' },
    ];
  }
  items: MenuItem[] | undefined;
  protected readonly title = signal('spooltracking');
}
