import {Component, input} from '@angular/core';
import {IQuestion} from 'src/app/question/models/question.interface';
import {MatIconModule} from '@angular/material/icon';
import {QuestionItemComponent} from 'src/app/question/components/question-item/question-item.component';

@Component({
  selector: 'ta-questions-block',
  imports: [MatIconModule, QuestionItemComponent],
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss']
})
export class QuestionsComponent {
  public questions = input.required<IQuestion[]>();
}
