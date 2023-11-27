import { Injectable } from '@angular/core';
import { IMaskFactory } from './imask-factory';
import IMask from 'imask';


@Injectable({ providedIn: 'root' })
export class DefaultImaskFactory implements IMaskFactory {
    create<Opts extends IMask.AnyMaskedOptions>(el: IMask.MaskElement | IMask.HTMLMaskingElement, opts: Opts) {
        return IMask(el, opts);
    }
}
