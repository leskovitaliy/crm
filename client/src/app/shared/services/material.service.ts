import { ElementRef } from '@angular/core';

declare var M;

export interface IMaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
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
}
