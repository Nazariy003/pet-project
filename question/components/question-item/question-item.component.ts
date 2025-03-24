import {Component, inject, input} from '@angular/core';
import {IQuestion} from 'src/app/question/models/question.interface';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {SlicePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {ViewModalQuestionComponent} from '../view-question-modal/view-question-modal.component';
import {RemoveModalQuestionComponent} from 'src/app/question/components/remove-question-modal/remove-question-modal.component';
import {CreateQuestionModalComponent} from 'src/app/question/components/create-question-modal/create-question-modal.component';
import {AVAILABLE_TOPICS} from 'src/app/question/mock-questions';

enum TooltipPosition {
  Above = 'above',
  Below = 'below'
}

@Component({
  selector: 'ta-question-item',
  imports: [MatIconModule, MatTooltipModule, SlicePipe],
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss'
})
export class QuestionItemComponent {
  public question = input.required<IQuestion>();

  private dialog = inject(MatDialog);

  protected openViewModal(question: IQuestion) {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    this.dialog.open(ViewModalQuestionComponent, {
      autoFocus: false,
      data: question,
      disableClose: true
    });
  }

  protected openRemoveModal(event: Event, question: IQuestion) {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    event.stopPropagation();

    this.dialog.open(RemoveModalQuestionComponent, {
      autoFocus: false,
      data: question,
      disableClose: true,
      panelClass: 'modal-dialog'
    });
  }

  protected openQuestionModal(event: Event, question: IQuestion | null) {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    event.stopPropagation();

    this.dialog.open(CreateQuestionModalComponent, {
      autoFocus: false,
      data: {
        question: question || null,
        topics: AVAILABLE_TOPICS,
        isEdit: !!question
      },
      disableClose: true,
      panelClass: 'modal-dialog'
    });
  }

  // Adjusts the position of the tooltip based on the button's position
  protected setTooltipPosition(tooltip: MatTooltip, button: HTMLElement) {
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (buttonRect.bottom + 100 > viewportHeight) {
      tooltip.position = TooltipPosition.Above;
    } else {
      tooltip.position = TooltipPosition.Below;
    }

    tooltip.tooltipClass = `action-tooltip tooltip-${tooltip.position}`;
  }
}
