import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ButtonDirective} from 'src/app/directives/button/button.directive';

@Component({
  selector: 'ta-remove-question-modal',
  imports: [MatIconModule, ButtonDirective],
  templateUrl: './remove-question-modal.component.html',
  styleUrl: './remove-question-modal.component.scss'
})
export class RemoveModalQuestionComponent {
  private dialogRef = inject(MatDialogRef<RemoveModalQuestionComponent>);
  public question = inject(MAT_DIALOG_DATA);

  protected close(): void {
    this.dialogRef.close();
  }
}
