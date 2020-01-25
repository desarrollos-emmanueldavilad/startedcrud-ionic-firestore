import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InicioInquilinoPage } from './inicio-inquilino.page';
import { InquilinoProfileResolver } from './inicio-inquilino.resolve';

const routes: Routes = [
  {
    path: '',
    component: InicioInquilinoPage,
    resolve: {
      data: InquilinoProfileResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InicioInquilinoPage],
  providers: [InquilinoProfileResolver]
})
export class InicioInquilinoPageModule {}
