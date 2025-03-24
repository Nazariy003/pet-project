import {Component, inject, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {QuestionService} from '../../services/question.service';
import {IQuestion} from '../../models/question.interface';
import {ITopic} from '../../models/topic.interface';

@Component({
  selector: 'ta-create-question-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatAutocompleteModule
  ],
  templateUrl: './create-question-modal.component.html',
  styleUrls: ['./create-question-modal.component.scss']
})
export class CreateQuestionModalComponent {
  closeModal = output<void>();
  questionCreated = output<IQuestion>();

  private fb = inject(FormBuilder);
  private questionService = inject(QuestionService);
  private snackBar = inject(MatSnackBar);

  questionForm!: FormGroup;
  questionTypes = ['text', 'code'];
  isSubmitting = signal(false);
  availableTopics = signal<ITopic[]>([]);
  selectedTopics = signal<ITopic[]>([]);

  constructor() {
    this.initForm();
    this.loadAvailableTopics();
  }

  private initForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.maxLength(800)]],
      type: ['', Validators.required],
      time: ['', [Validators.required, Validators.min(1), Validators.max(240)]],
      topicIds: [[], [Validators.required, this.validateTopicsCount()]],
      maxLength: ['15', Validators.required]
    });
  }

  validateTopicsCount() {
    return (control: any) => {
      const topics = control.value;
      if (!topics || topics.length === 0) {
        return {required: true};
      }
      if (topics.length > 5) {
        return {maxTopics: true};
      }
      return null;
    };
  }

  loadAvailableTopics(): void {
    this.questionService.getTopics().subscribe({
      next: (topics: ITopic[]) => {
        if (topics) {
          const topicsWithId = topics.map(topic => ({
            ...topic,
            _id: topic._id || topic.id || this.generateTempId(topic.title)
          }));
          this.availableTopics.set(topicsWithId);
        }
      },
      error: err => console.error('Failed to load topics', err)
    });
  }

  private generateTempId(title: string): string {
    return `temp_${title.toLowerCase().replace(/\s+/g, '_')}`;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.questionForm.value;

    this.questionService.createQuestion(formValues).subscribe({
      next: response => {
        this.isSubmitting.set(false);
        this.questionCreated.emit(response.data);
        this.onClose();
        this.snackBar.open('Question created successfully', 'Close', {
          duration: 3000
        });
      },
      error: err => {
        this.isSubmitting.set(false);
        console.error('Failed to create question', err);
        this.snackBar.open(err.error?.error || 'Failed to create question', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  addTopic(topic: ITopic): void {
    const topicId = topic._id || topic.id || this.generateTempId(topic.title);
    const topicIds = this.questionForm.get('topicIds')?.value || [];

    if (topicIds.length < 5 && !topicIds.includes(topicId)) {
      topicIds.push(topicId);
      this.questionForm.get('topicIds')?.setValue(topicIds);

      const topicWithId = {...topic, _id: topicId};
      const currentTopics = this.selectedTopics();
      this.selectedTopics.set([...currentTopics, topicWithId]);
    }
  }

  removeTopic(topicId: string): void {
    const topicIds = this.questionForm.get('topicIds')?.value || [];
    const index = topicIds.indexOf(topicId);

    if (index >= 0) {
      topicIds.splice(index, 1);
      this.questionForm.get('topicIds')?.setValue(topicIds);

      const currentTopics = this.selectedTopics();
      this.selectedTopics.set(currentTopics.filter(t => (t._id || t.id) !== topicId));
    }
  }

  getSelectedTopicsCount(): number {
    return this.questionForm.get('topicIds')?.value?.length || 0;
  }

  hasTopicError(): boolean {
    const control = this.questionForm.get('topicIds');
    return (control?.invalid && (control?.dirty || control?.touched)) || false;
  }

  getTitleCount(): string {
    return `${this.questionForm.get('title')?.value?.length || 0}/250`;
  }

  getDescriptionCount(): string {
    return `${this.questionForm.get('description')?.value?.length || 0}/800`;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.questionForm.get(fieldName);

    if (!control) return '';

    if (control.hasError('required')) {
      return "This field can't be empty";
    }

    if (control.hasError('maxlength')) {
      switch (fieldName) {
        case 'title':
          return 'You have exceeded the maximum number of 250 characters in this field';
        case 'description':
          return 'You have exceeded the maximum number of 800 characters in this field';
        default:
          return 'Maximum length exceeded';
      }
    }

    if (control.hasError('min')) {
      return 'Value must be at least 1';
    }

    if (control.hasError('max')) {
      return 'Value cannot exceed 240';
    }

    return '';
  }

  isTopicSelected(topicId: string): boolean {
    return this.selectedTopics().some(t => (t._id || t.id) === topicId);
  }

  getTopicId(topic: ITopic): string {
    return topic._id || topic.id || this.generateTempId(topic.title);
  }
}
