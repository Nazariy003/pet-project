import {Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MinutesFormatPipe} from 'src/app/question/models/minutes-format.pipe';

@Component({
  selector: 'ta-view-question-modal',
  imports: [MatIconModule, MinutesFormatPipe],
  templateUrl: './view-question-modal.component.html',
  styleUrl: './view-question-modal.component.scss'
})
export class ViewModalQuestionComponent {
  private dialogRef = inject(MatDialogRef<ViewModalQuestionComponent>);
  public question = inject(MAT_DIALOG_DATA);

  protected close(): void {
    this.dialogRef.close();
  }
}
