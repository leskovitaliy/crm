import { ElementRef } from '@angular/core';

declare var M;

export interface IMaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface IMaterialDatepicker extends IMaterialInstance {
  date?: Date;
}

export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  }

  static initFloatingBtn(elemRef: ElementRef) {
    M.FloatingActionButton.init(elemRef.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(elemRef: ElementRef): IMaterialInstance {
    return M.Modal.init(elemRef.nativeElement);
  }

  static initTooltip(elemRef: ElementRef): IMaterialInstance {
    return M.Tooltip.init(elemRef.nativeElement);
  }

  static initDatepicker(elemRef: ElementRef, onClose: () => void): IMaterialDatepicker {
    return M.Datepicker.init(elemRef.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    });
  }

  static initTapTarget(elemRef: ElementRef): IMaterialInstance {
    return M.TapTarget.init(elemRef.nativeElement);
  }
 }
