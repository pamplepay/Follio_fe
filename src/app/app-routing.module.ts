import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AutoLoginGuard } from './core/service/guard/auto-login.guard';
import { InsuranceTemplateResolver } from './shared/resolver/insurance-template.resolver';
import { AuthGuard } from './core/service/guard/auth.guard';
import { AnalysisResolver } from './shared/resolver/analysis.resolver';
import { InsuranceAnalysisResolver } from './shared/resolver/insurance-analysis-resolver.service';
import { MyInsuranceAnalysisResolverService } from './shared/resolver/my-insurance-analysis-resolver.service';
import { MyCompareResolver } from './shared/resolver/my-compare.resolver';
import { CompareResolver } from './shared/resolver/compare.resolver';
import { MyAnalysisResolver } from './shared/resolver/my-analysis.resolver';

const routes: Routes = [
  {
    path:        '',
    canActivate: [
      AutoLoginGuard
    ],
    resolve:     {},
    children:    [
      {
        path:         '',
        loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
      },
      {
        path:         'main',
        loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
      },
      {
        path:         'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'customer',
        loadChildren: () => import('./pages/customer/customer.module').then(m => m.CustomerModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'customer/create',
        loadChildren: () => import('./pages/customer-create/customer-create.module').then(m => m.CustomerCreateModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'customer/:id',
        loadChildren: () => import('./pages/customer-id/customer-id.module').then(m => m.CustomerIdModule)
      },
      {
        path:         'customer/:id/agree',
        loadChildren: () => import('./pages/customer-agree/customer-agree.module').then(m => m.CustomerAgreeModule)
      },
      {
        path:         'customer/:id/analysis',
        loadChildren: () => import('./pages/customer-analysis/customer-analysis.module').then(m => m.CustomerAnalysisModule),
        resolve: {
          analysis: MyAnalysisResolver
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'template/:id/analysis',
        loadChildren: () => import('./pages/customer-analysis/customer-analysis.module').then(m => m.CustomerAnalysisModule),
        resolve: {
          analysis: MyInsuranceAnalysisResolverService
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'template/:id/analysis/:share',
        loadChildren: () => import('./pages/customer-analysis/customer-analysis.module').then(m => m.CustomerAnalysisModule),
        resolve: {
          analysis: InsuranceAnalysisResolver
        }
      },
      {
        path:         'insurance/:id/analysis',
        loadChildren: () => import('./pages/customer-analysis/customer-analysis.module').then(m => m.CustomerAnalysisModule),
        resolve: {
          analysis: MyInsuranceAnalysisResolverService
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'insurance/:id/analysis/:share',
        loadChildren: () => import('./pages/customer-analysis/customer-analysis.module').then(m => m.CustomerAnalysisModule),
        resolve: {
          analysis: InsuranceAnalysisResolver
        }
      },
      {
        path:         'customer/:id/compare',
        loadChildren: () => import('./pages/customer-compare/customer-compare.module').then(m => m.CustomerCompareModule),
        resolve: {
          compare: MyCompareResolver
        }
      },
      {
        path:         'customer/:id/analysis/:share',
        loadChildren: () => import('./pages/customer-analysis/customer-analysis.module').then(m => m.CustomerAnalysisModule),
        resolve: {
          analysis: AnalysisResolver
        }
      },
      {
        path:         'customer/:id/compare/:share',
        loadChildren: () => import('./pages/customer-compare/customer-compare.module').then(m => m.CustomerCompareModule),
        resolve: {
          compare: CompareResolver
        }
      },
      {
        path:         'insurance',
        loadChildren: () => import('./pages/insurance/insurance.module').then(m => m.InsuranceModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'template',
        loadChildren: () => import('./pages/template/template.module').then(m => m.TemplateModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'template/create',
        loadChildren: () => import('./pages/template-form/template-form.module').then(m => m.TemplateFormModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'template/edit/:id',
        resolve:      {
          insuranceTemplate: InsuranceTemplateResolver
        },
        loadChildren: () => import('./pages/template-form/template-form.module').then(m => m.TemplateFormModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'insurance/create',
        loadChildren: () => import('./pages/insurance-id/insurance-id.module').then(m => m.InsuranceIdModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'insurance/:id',
        loadChildren: () => import('./pages/insurance-id/insurance-id.module').then(m => m.InsuranceIdModule),
        canActivate: [
          AuthGuard
        ]
      },
      {
        path:         'price',
        loadChildren: () => import('./pages/price/price.module').then(m => m.PriceModule)
      },
      {
        path:         'payment',
        loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentModule)
      },
      {
        path:         'purchase/:id',
        loadChildren: () => import('./pages/purchase/purchase.module').then(m => m.PurchaseModule),
        canActivate: [
          AuthGuard
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution:    'legacy',
      scrollPositionRestoration: 'enabled',
      preloadingStrategy:        PreloadAllModules,
      onSameUrlNavigation:       'reload'
    })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
