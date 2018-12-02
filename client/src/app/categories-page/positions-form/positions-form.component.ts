import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PositionsService } from '../../shared/services/positions.service';
import { IPosition } from '../../shared/interfaces';
import { IMaterialInstance, MaterialService } from '../../shared/services/material.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  positions: IPosition[] = [];
  modal: IMaterialInstance;

  @ViewChild('modal') modalRef: ElementRef;

  @Input() categoryId: string;

  constructor(private positionsService: PositionsService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
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
    this.modal.open();
  }

  onAddPosition() {
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }

}
