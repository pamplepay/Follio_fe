import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  HostListener,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutModalService } from './layout-modal.service';
import { ComponentHandler } from '../../core/handler/component-handler/component-handler';

@Component({
  selector:    'app-layout-modal',
  templateUrl: './layout-modal.component.html',
  styleUrls:   [ './layout-modal.component.scss' ]
})
export class LayoutModalComponent implements OnInit {

  isOpen: boolean = false;

  @ViewChild('target', { read: ViewContainerRef })
  target: any | null = null;

  modal$: Observable<any> | null = null;

  componentReferenceList: any[] = [];

  constructor(
    private resolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: LayoutModalService) {
  }

  @HostListener('touchmove', ['$event'])
  handleTouchmove(event: Event){
    event.preventDefault();
  }


  ngOnInit() {
    this.modal$ = this.modalService.rxModal();

    this.modal$?.subscribe(
      (result: any) => {
        const component = result.component;
        const params    = result.params || {};

        if (result.isOpen) {
          this.isOpen = true;
          this.changeDetectorRef.detectChanges();
          const componentReference = ComponentHandler.createComponent(this.resolver, this.target, component, params);
          this.componentReferenceList.push(componentReference);
          document.body.style.overflow = 'hidden';
        }

        if (!result.isOpen) {
          this.closeLastModal();

          if (this.componentReferenceList.length === 0) {
            this.isOpen = false;
          }
          this.changeDetectorRef.detectChanges();
          document.body.style.overflow = '';
        }
      }
    );
  }

  onCloseModal() {
    this.closeLastModal();

    if (this.componentReferenceList.length === 0) {
      this.isOpen = false;
    }
  }

  closeLastModal() {
    const componentRef = this.componentReferenceList.pop();
    if (componentRef) {
      componentRef.destroy();
    }
  }
}
