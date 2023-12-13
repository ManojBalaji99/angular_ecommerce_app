import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {

  @Output() showCategory = new EventEmitter<string>(); // child to parent 


  categories = ["All","Fruit","Vegetable","Grains","Dairy"];  // from backend 

  
  onShowCategory(category: string): void {
  this.showCategory.emit(category)

}

}
