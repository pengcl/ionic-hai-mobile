import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ThemeModule} from '../../../@theme/theme.module';
import {PolicyListPage} from './list.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ThemeModule,
    RouterModule.forChild([{path: '', component: PolicyListPage}])
  ],
  declarations: [PolicyListPage]
})
export class PolicyListPageModule {
}
