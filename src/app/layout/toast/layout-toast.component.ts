import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentHandler } from '../../core/handler/component-handler/component-handler';
import { TOAST_ANIMATION_TIME, ToastParams } from './layout-taost.model';
import { LayoutToastService } from './layout-toast.service';
import { BasicToastComponent } from './basic-toast/basic-toast.component';

@Component({
  selector: 'app-layout-toast',
  templateUrl: './layout-toast.component.html',
  styleUrls: ['./layout-toast.component.scss']
})
export class LayoutToastComponent implements OnInit {

  @ViewChild('target', { read: ViewContainerRef })
  target: any;

  toast$: Observable<any>;

  componentReferenceList: any[] = [];

  constructor(
    private resolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: LayoutToastService) {
  }

  ngOnInit() {
    this.toast$ = this.toastService.rxToast();
    console.log('this.toast$', this.toast$);

    this.toast$?.subscribe((params: ToastParams) => {
      console.log('toast?', params);
        const component = params.component;
        const data    = params.data || {};

        if (params.isShow) {
          this.changeDetectorRef.detectChanges();
          data.index = this.componentReferenceList.length;
          data.id = params.id;
          const componentReference = ComponentHandler.createComponent(this.resolver, this.target, component, data);
          this.componentReferenceList.push(componentReference);
        }

        if (!params.isShow) {
          this.dismissToast(params.id);

          if (this.componentReferenceList.length === 0) {}
          this.changeDetectorRef.detectChanges();
        }
      }
    );
  }

  dismissToast(id: symbol) {
    const dismissIndex = this.componentReferenceList.findIndex((componentReference) => {
      return componentReference.instance['id'] === id
    });
    console.log('dismissIndex', dismissIndex);
    if(dismissIndex === -1) {
      return;
    }

    const dismissItem: any = this.componentReferenceList.splice(dismissIndex, 1)[0];
    if (dismissItem) {
      dismissItem?.destroy();
    }

    setTimeout(() => {
      for(let index = 0; index < this.componentReferenceList.length; index++) {
        const item = this.componentReferenceList?.[index];
        if (!item) {
          break;
        }

        item.instance['index'] = index;
      }
    }, TOAST_ANIMATION_TIME)
  }
}
