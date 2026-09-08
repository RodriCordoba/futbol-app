import { Routes } from '@angular/router';
import { TablaComponent } from './pages/tabla/tabla';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/admin';
import { HistorialComponent } from './pages/historial/historial'; // <-- Nuevo
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: TablaComponent },
  { path: 'historial', component: HistorialComponent }, // <-- Nueva ruta
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];