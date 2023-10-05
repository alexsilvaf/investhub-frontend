import { Routes } from '@angular/router';

import { InvestmentComponent } from 'app/components/investment/investment.component';
import { UserProfileComponent } from 'app/components/user-profile/user-profile.component';
import { TableListComponent } from 'app/components/table-list/table-list.component';
import { TypographyComponent } from 'app/components/typography/typography.component';
import { IconsComponent } from 'app/icons/icons.component';
import { NotificationsComponent } from 'app/components/notifications/notifications.component';
import { HomeComponent } from 'app/components/home/home.component';
import { ManageAssetsComponent } from 'app/components/manage-assets/manage-assets.component';

export const InvestHubLayoutRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',      component: HomeComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'investments',      component: InvestmentComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'management',  component: ManageAssetsComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'user-profile',   component: UserProfileComponent },
];
