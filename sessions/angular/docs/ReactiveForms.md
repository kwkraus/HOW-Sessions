# Reactive Forms
https://angular.io/guide/reactive-forms

## Refactor form from Template-Driven to Model-Drive (i.e. Reactive Form)

### collection.module.ts
Import the ReactiveForms module.

```javascript
@NgModule({
  imports: [
    CommonModule,
    CollectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
```
### new-book.component.ts

```javascript
import { FormGroup, FormControl } from '@angular/forms';

  profileForm = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    isCheckedOut: new FormControl(false),
    rating: new FormControl(0);
  });
```
### new-book.component.html