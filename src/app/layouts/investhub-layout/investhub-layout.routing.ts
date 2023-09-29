import { Routes } from '@angular/router';

import { InvestmentComponent } from 'app/components/investment/investment.component';
import { UserProfileComponent } from 'app/components/user-profile/user-profile.component';
import { TableListComponent } from 'app/components/table-list/table-list.component';
import { TypographyComponent } from 'app/components/typography/typography.component';
import { IconsComponent } from 'app/icons/icons.component';
import { NotificationsComponent } from 'app/components/notifications/notifications.component';

export const InvestHubLayoutRoutes: Routes = [
    { path: 'investments',      component: InvestmentComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'notifications',  component: NotificationsComponent },
];
