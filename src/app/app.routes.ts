import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { Portfolio } from './pages/portfolio/portfolio';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'services', component: Services },
  { path: 'portfolio', component: Portfolio },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];