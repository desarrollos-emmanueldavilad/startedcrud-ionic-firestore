import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { InicioInquilinoPageModule } from '../inicio-inquilino/inicio-inquilino.module';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'tab1', loadChildren: () => InicioInquilinoPageModule },
    //  { path: 'tab1/ejercicio-user', loadChildren: () => EjercicioUserPageModule },

     //   { path: 'tab2', loadChildren: () => DiarioDieteticoPageModule },
     //   { path: 'tab3', loadChildren: () => DietasPacientesPageModule },

     //   { path: 'tab4', loadChildren: () => MipesoPageModule }, // ESTA EN DUDA PARA CREAR MI PESO USER

      //  { path: 'tab5', loadChildren: () => DiarioEjercicioPageModule },
      //  { path: 'tab6', loadChildren: () => ListaCitasPageModule },



    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/tabs/tab2',
    pathMatch: 'full'
  },

  {
    path: '',
    redirectTo: '/tabs/tab3',
    pathMatch: 'full'
  },

  {
    path: '',
    redirectTo: '/tabs/tab4',
    pathMatch: 'full'
  },

  {
    path: '',
    redirectTo: '/tabs/tab5',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
