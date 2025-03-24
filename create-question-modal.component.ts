import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, map, startWith} from 'rxjs';

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
export class CreateQuestionModalComponent implements OnInit {
  close = output<void>();
  questionCreated = output<IQuestion>();
  data = input<{isEdit: boolean; question?: IQuestion}>({isEdit: false});

  private fb = inject(FormBuilder);
  private questionService = inject(QuestionService);
  private snackBar = inject(MatSnackBar);

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  questionForm!: FormGroup;
  questionTypes = ['text', 'code'];
  isSubmitting = signal(false);
  availableTopics = signal<ITopic[]>([]);
  selectedTopics = signal<ITopic[]>([]);
  topicInputControl = new FormControl('');
  filteredTopics!: Observable<ITopic[]>;

  ngOnInit(): void {
    this.filteredTopics = this.topicInputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTopics(value || ''))
    );

    // If editing, populate form with question data
    if (this.data().isEdit && this.data().question) {
      this.populateFormForEdit();
    }
  }

  private _filterTopics(value: string): ITopic[] {
    const filterValue = value.toLowerCase();
    return this.availableTopics().filter(
      topic =>
        topic.title.toLowerCase().includes(filterValue) &&
        !this.isTopicSelected(this.getTopicId(topic))
    );
  }

  constructor() {
    this.initForm();
    this.loadAvailableTopics();
  }

  private initForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.required, Validators.maxLength(800)]],
      type: ['', Validators.required],
      time: [
        '',
        [Validators.required, Validators.pattern('^([0-9]|[0-9][0-9]|[0-2][0-4][0-9]):[0-5][0-9]$')]
      ],
      topicIds: [[], [Validators.required, this.validateTopicsCount()]]
    });
  }

  private populateFormForEdit(): void {
    const question = this.data().question;
    if (!question) return;

    this.questionForm.patchValue({
      title: question.title,
      description: question.description,
      type: question.type,
      time: this.formatTime(question.time)
    });

    // Handle topics
    if (question.topics && Array.isArray(question.topics)) {
      // Extract topic IDs and full objects
      const topicIds: string[] = [];
      const topicObjects: ITopic[] = [];

      question.topics.forEach(topic => {
        if (typeof topic === 'string') {
          // If it's just a string ID
          topicIds.push(topic);

          // Try to find the topic object in available topics
          const foundTopic = this.availableTopics().find(t => t._id === topic || t.id === topic);

          if (foundTopic) {
            topicObjects.push(foundTopic);
          } else {
            // Create a minimal topic object if not found
            topicObjects.push({
              _id: topic,
              id: topic,
              title: topic // Using ID as title as fallback
            });
          }
        } else {
          // It's already a topic object
          topicIds.push(topic._id || topic.id || '');
          topicObjects.push(topic);
        }
      });

      // Set the form control with string IDs
      this.questionForm.get('topicIds')?.setValue(topicIds.filter(Boolean));

      // Set the selected topics with the full objects
      this.selectedTopics.set(topicObjects);
    }
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
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
        if (topics && Array.isArray(topics)) {
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
    return `temp_${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.questionForm.getRawValue();

    // Prepare data for API
    const questionData: Partial<IQuestion> = {
      title: formValues.title,
      description: formValues.description,
      type: formValues.type,
      time: this.parseTimeToMinutes(formValues.time),
      topicIds: formValues.topicIds // The backend expects topicIds as string[]
    };

    const apiCall =
      this.data().isEdit && this.data().question?._id
        ? this.questionService.updateQuestion(this.data().question._id, questionData)
        : this.questionService.createQuestion(questionData);

    apiCall.subscribe({
      next: response => {
        this.isSubmitting.set(false);
        this.questionCreated.emit(response.data);
        this.close();
        this.snackBar.open(
          this.data().isEdit ? 'Question updated successfully' : 'Question created successfully',
          'Close',
          {duration: 3000}
        );
      },
      error: err => {
        this.isSubmitting.set(false);
        console.error('Failed to save question', err);
        this.snackBar.open(err.error?.error || 'Failed to save question', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  addTime(minutes: number): void {
    const currentTimeStr = this.questionForm.get('time')?.value || '00:00';
    let totalMinutes = this.parseTimeToMinutes(currentTimeStr) + minutes;

    // Ensure time is within valid range (0-240 minutes)
    totalMinutes = Math.max(0, Math.min(240, totalMinutes));

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
    this.questionForm.get('time')?.setValue(formattedTime);
    this.questionForm.get('time')?.markAsDirty();
    this.questionForm.get('time')?.markAsTouched();
  }

  addTopic(topic: ITopic): void {
    // Make sure we have a valid topic with an ID
    if (!topic || typeof topic !== 'object') return;

    const topicId = topic._id || topic.id || '';
    if (!topicId) return; // Skip if no valid ID

    const topicIds = this.questionForm.get('topicIds')?.value || [];

    if (topicIds.length < 5 && !topicIds.includes(topicId)) {
      // Add to form control (string IDs)
      topicIds.push(topicId);
      this.questionForm.get('topicIds')?.setValue(topicIds);

      // Add to selected topics signal (ITopic objects)
      const topicWithId = {...topic, _id: topicId};
      const currentTopics = this.selectedTopics();
      this.selectedTopics.set([...currentTopics, topicWithId]);
    } else if (topicIds.length >= 5) {
      this.snackBar.open('Maximum 5 topics allowed per question', 'Close', {
        duration: 3000
      });
    }
  }

  addNewTopic(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (!value) return;

    // Check if topic already exists
    const existingTopic = this.availableTopics().find(
      t => t.title.toLowerCase() === value.toLowerCase()
    );

    if (existingTopic) {
      // If topic exists but not selected, add it
      if (!this.isTopicSelected(this.getTopicId(existingTopic))) {
        this.addTopic(existingTopic);
      }
    } else {
      // Generate a temp ID
      const tempId = this.generateTempId(value);

      // Create new topic with all required fields as non-undefined values
      const newTopic: ITopic = {
        title: value,
        _id: tempId,
        id: tempId, // Provide both _id and id to ensure one is available
        createdAt: new Date().toISOString(),
        isNew: true
      };

      // Add to available topics
      this.availableTopics.update(topics => [...topics, newTopic]);

      // Add to selected topics
      this.addTopic(newTopic);

      // Create topic on server
      this.questionService.createTopic(newTopic).subscribe({
        next: response => {
          if (response && response.data && response.data._id) {
            // Replace temporary ID with server ID
            this.updateTopicId(newTopic._id as string, response.data._id);
          }
        },
        error: err => {
          console.error('Failed to create topic', err);
        }
      });
    }

    // Clear the input
    if (event.chipInput) {
      event.chipInput.clear();
    }
    this.topicInputControl.setValue('');
  }

  updateTopicId(oldId: string, newId: string): void {
    if (!oldId || !newId) return;

    // Update in selected topics
    this.selectedTopics.update(topics =>
      topics.map(t => (t._id === oldId || t.id === oldId ? {...t, _id: newId, id: newId} : t))
    );

    // Update in available topics
    this.availableTopics.update(topics =>
      topics.map(t => (t._id === oldId || t.id === oldId ? {...t, _id: newId, id: newId} : t))
    );

    // Update in form control (string array)
    const topicIds = this.questionForm.get('topicIds')?.value || [];
    const updatedIds = topicIds.map((id: string) => (id === oldId ? newId : id));
    this.questionForm.get('topicIds')?.setValue(updatedIds);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent, input: HTMLInputElement): void {
    const selectedTitle = event.option.viewValue;
    const selectedTopic = this.availableTopics().find(t => t.title === selectedTitle);

    if (selectedTopic) {
      this.addTopic(selectedTopic);
    }

    // Clear the input
    if (input) {
      input.value = '';
    }
    this.topicInputControl.setValue('');
  }

  removeTopic(topicId: string): void {
    if (!topicId) return;

    // Remove from form control (string array)
    const topicIds = this.questionForm.get('topicIds')?.value || [];
    const index = topicIds.indexOf(topicId);

    if (index >= 0) {
      topicIds.splice(index, 1);
      this.questionForm.get('topicIds')?.setValue(topicIds);

      // Remove from selected topics signal (ITopic objects)
      const currentTopics = this.selectedTopics();
      this.selectedTopics.set(currentTopics.filter(t => !(t._id === topicId || t.id === topicId)));
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

    if (control.hasError('pattern') && fieldName === 'time') {
      return 'Please enter a valid time format (HH:MM)';
    }

    if (control.hasError('maxTopics')) {
      return 'Maximum 5 topics allowed';
    }

    return '';
  }

  markControlAsTouched(controlName: string): void {
    this.questionForm.get(controlName)?.markAsTouched();
  }

  isTopicSelected(topicId: string): boolean {
    if (!topicId) return false;

    return this.selectedTopics().some(t => t._id === topicId || t.id === topicId);
  }

  getTopicId(topic: ITopic): string {
    if (!topic) return '';
    return topic._id || topic.id || '';
  }
}
