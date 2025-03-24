import {Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
//import {AVAILABLE_TOPICS, MOCK_QUESTIONS} from './mock-questions';
import {IQuestion} from 'src/app/question/models/question.interface';
import {FiltersBlockComponent} from 'src/app/question/components/filters-block/filters-block.component';
import {CreateQuestionModalComponent} from 'src/app/question/components/create-question-modal/create-question-modal.component';
import {QuestionsComponent} from 'src/app/question/components/questions-block/questions-block.component';
import {ButtonDirective} from 'src/app/directives/button/button.directive';
import {MatDialog} from '@angular/material/dialog';
import {QuestionService} from './services/question.service';
import {QuestionTypes} from './models/question-type.enum';

interface QuestionsResponse {
  data: IQuestion[];
  total: number;
}
@Component({
  selector: 'ta-question',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FiltersBlockComponent,
    ButtonDirective,
    QuestionsComponent
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  private dialog = inject(MatDialog);

  //public questions: IQuestion[] = MOCK_QUESTIONS;
  //public availableTopics: string[] = AVAILABLE_TOPICS;

  private questionService = inject(QuestionService);

  questions = signal<IQuestion[]>([]);
  availableTopics = signal<any[]>([]);
  isModalOpen = signal(false);

  questionTypes = Object.values(QuestionTypes);

  ngOnInit(): void {
    this.loadQuestions();
    this.loadTopics();
  }

  loadQuestions(): void {
    this.questionService.getQuestions().subscribe({
      next: (response: QuestionsResponse) => {
        this.questions.set(response.data);
      },
      error: (err: any) => {
        console.error('Failed to load questions', err);
      }
    });
  }

  loadTopics(): void {
    this.questionService.getTopics().subscribe({
      next: (topics: any[]) => {
        if (topics) {
          this.availableTopics.set(topics);
        }
      },
      error: (err: any) => console.error('Failed to load topics', err)
    });
  }

  openCreateModal(): void {
    this.isModalOpen.set(true);
  }

  handleCloseModal(): void {
    this.isModalOpen.set(false);
  }

  handleQuestionCreated(newQuestion: IQuestion): void {
    this.questions.update(current => [newQuestion, ...current]);
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
        topics: this.availableTopics,
        isEdit: !!question
      },
      disableClose: true,
      panelClass: 'modal-dialog'
    });
  }
}
