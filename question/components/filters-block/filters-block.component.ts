import {Component, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';

@Component({
  selector: 'ta-filters-block',
  standalone: true,
  imports: [
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './filters-block.component.html',
  styleUrls: ['./filters-block.component.scss']
})
export class FiltersBlockComponent {
  public selectedTopics = signal<string[]>([]);
  public availableTopics = input.required<string[]>();

  public topicInputControl = new FormControl('');

  public filteredTopics: Observable<string[]> = this.topicInputControl.valueChanges.pipe(
    startWith(null),
    map((value: string | null) => (value ? this.filterTopics(value) : []))
  );

  public removeTopic(topic: string): void {
    this.selectedTopics.update(topics => topics.filter(t => t !== topic));
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent, input: HTMLInputElement): void {
    const value = event.option.value.trim();
    if (value && !this.selectedTopics().includes(value)) {
      this.selectedTopics.update(topics => [...topics, value]);
    }
    input.value = '';
    this.topicInputControl.setValue('');
  }

  private filterTopics(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableTopics().filter(topic => topic.toLowerCase().startsWith(filterValue));
  }
}
