import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { PositionsService } from '../../shared/services/positions.service';
import { IPosition } from '../../shared/interfaces';
import { IMaterialInstance, MaterialService } from '../../shared/services/material.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  positions: IPosition[] = [];
  modal: IMaterialInstance;
  form: FormGroup;
  positionId = null;

  @ViewChild('modal') modalRef: ElementRef;

  @Input() categoryId: string;

  constructor(private positionsService: PositionsService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      cost: [1, [Validators.required, Validators.min(1)]]
    });

    this.loading = true;
    this.positionsService.get(this.categoryId)
      .subscribe((positions: IPosition[]) => {
          this.positions = positions;
          this.loading = false;
          this.cdr.detectChanges();
        }
      );
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onSelectPosition(position: IPosition) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
    this.cdr.detectChanges();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({ name: null, cost: 1 });
    this.modal.open();
    MaterialService.updateTextInputs();
    this.cdr.detectChanges();
  }

  onDeletePosition(event: Event, position: IPosition) {
    event.stopPropagation();
    const decision = window.confirm(`Remove position: ${position.name} ?`);

    if (decision) {
      this.positionsService.delete(position)
        .subscribe(
          response => {
            const index = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(index, 1);
            MaterialService.toast(response.message);
            this.cdr.detectChanges();
          }
        );
    }
  }

  onCancel() {
    this.modal.close();
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: IPosition = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition)
        .subscribe((position: IPosition) => {
            const index = this.positions.findIndex(p => p._id === position._id);
            this.positions[index] = position;
            MaterialService.toast('Position updated');
            this.cdr.detectChanges();
          }, err => MaterialService.toast(err.error.message),
          () => this.completed);
    } else {
      this.positionsService.create(newPosition)
        .subscribe((position: IPosition) => {
            MaterialService.toast('Position created');
            this.positions.push(position);
            this.cdr.detectChanges();
          }, err => MaterialService.toast(err.error.message),
          () => this.completed);
    }
  }

  private completed() {
    this.modal.close();
    this.form.reset({ name: '', cost: 1 });
    this.form.enable();
    this.cdr.detectChanges();
  }

}
