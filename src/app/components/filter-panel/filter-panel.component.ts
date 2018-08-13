import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterOption } from '../../models/filter-group.model';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  @Input() filterOptions: FilterOption[];
  @Output() formChange = new EventEmitter<{query: any, filterOption: FilterOption}>();

  searchForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.searchForm = new FormGroup({
      query: new FormControl(''),
      filterOption: new FormControl(this.filterOptions[0])
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(200))
      .subscribe( () => {
        const filterOption: FilterOption = {
          props: this.searchForm.value.filterOption.props,
          label: this.searchForm.value.filterOption.label
        };
        const query: string = this.searchForm.value.query;
        this.formChange.emit({ query, filterOption });
      }
    );
  }
}
