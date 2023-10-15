import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InvestmentComponent } from './investment/investment.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MaterialModule } from 'app/material/material.module';
import { HomeComponent } from './home/home.component';
import { ManageAssetsComponent } from './manage-assets/manage-assets.component';
import { CurrencyValuePipe } from 'app/pipes/currency-value.pipe';
import { DoubleNumberDirective } from 'app/directives/format-currency-number/double-number.directive';
import { IntegerNumberDirective } from 'app/directives/integer-number/integer-number.directive';
import { IntegerValuePipe } from 'app/pipes/number-value';

const COMPONENTS = [
  HomeComponent,
  FooterComponent,
  InvestmentComponent,
  NavbarComponent,
  NotificationsComponent,
  ManageAssetsComponent,
  SidebarComponent,
  TableListComponent,
  TypographyComponent,
  UserProfileComponent,
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    CurrencyValuePipe,
    IntegerValuePipe,
    DoubleNumberDirective,
    IntegerNumberDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class ComponentsModule { }
