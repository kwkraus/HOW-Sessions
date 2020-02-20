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

Add property to component for the form model.

```diff
+ import { FormGroup, FormControl } from '@angular/forms';

-  book: IBook;
   ngOnInit() {
-    this.book = {
-      id: 0,
-      title: '',
-      author: '',
-      isCheckedOut: false,
-      rating: 0
-    };
   }

+  newBookForm = new FormGroup({
+    title: new FormControl(''),
+    author: new FormControl(''),
+    isCheckedOut: new FormControl(false),
+    rating: new FormControl(0)
+  });
```

```diff
  save(): void {
-    this._dialogRef.close(this.book);
+    this._dialogRef.close(this.newBookForm.value);
  }

  onRatingUpdate(rating: number): void {
-   this.book.rating = rating;
+    this.newBookForm.get('rating').setValue(rating);
  }
```
### new-book.component.html

```diff
- <form #newBookForm="ngForm">
+ <form [formGroup]="newBookForm">
```

```diff
- [(ngModel)]="book.title"
+ formControlName="title"

- [(ngModel)]="book.author"
+ formControlName="author"

- [(ngModel)]="book.isCheckedOut"
+ formControlName="isCheckedOut"

- <my-rating [rating]="book.rating" >
+ <my-rating [rating]="newBookForm.get('rating')" >

- <button type="submit " [disabled]="newBookForm.form.invalid">
+ <button type="submit " [disabled]="newBookForm.invalid">
```

## Run and examine form

### new-book.component.ts
Set a breakpoint when rating updated and book saved.
```javascript
  save(): void {
  }
  onRatingUpdate(rating: number): void {
  }
```

## Add Validation

### new-book.component.ts
```javascript
import { Validators } from '@angular/forms';

  newBookForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    author: new FormControl('', Validators.required),
    isCheckedOut: new FormControl(false),
    rating: new FormControl(0)
  });
```

### new-book.component.html
```diff
- <input matInput placeholder="Book Title" formControlName="title" name="title" required />
- <input matInput placeholder="Author" formControlName="author" name="author" required />
+ <input matInput placeholder="Book Title" formControlName="title" />
+ <input matInput placeholder="Author" formControlName="author" />
```

## FormBuilder syntax
https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder

### new-book.component.ts
```javascript
import { FormBuilder } from '@angular/forms';

  constructor(private _dialogRef: MatDialogRef<NewBookComponent>,
    private fb: FormBuilder) { }
```
Another service available to make the form easier.

```diff
-  newBookForm = new FormGroup({
-    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
-    author: new FormControl('', Validators.required),
-    isCheckedOut: new FormControl(false),
-    rating: new FormControl(0)
-  });

+  newBookForm = this.fb.group({
+    title: ['', [Validators.required, Validators.minLength(3)]],
+    author: ['', Validators.required],
+    isCheckedOut: [false],
+    rating: [0],
+    libraryAddress: this.fb.group({
+      street: [''],
+      city: [''],
+      state: [''],
+      zip: ['']
+    }),
+    reviews: this.fb.array([
+      this.fb.control('')
+    ]),
+  });
```

## React to form changes
The API for the AbstractControl class can be used to get & set properties of the FormControl, FormGroup, and FormArray.

https://angular.io/api/forms/AbstractControl#abstractcontrol

### new-book.component.ts
```javascript
  ngOnInit() {
    this.newBookForm.get('isCheckedOut').valueChanges.subscribe(
      isCheckedout => {
        console.log(`Is checkedout = ${isCheckedout}`);
      }
    );
  }
```

Other useful methods are to setValidators(), setValue(), enable(), disable()

## Dynamically constructed form
https://angular.io/guide/dynamic-form#question-form-components
question-control.service.ts

## Clean up for the next module

### new-book.component
```javascript
  book: IBook;
  ngOnInit() {
    this.book = {
      id: 0,
      title: '',
      author: '',
      isCheckedOut: false,
      rating: 0
    };
  }
```

Revert ts and html files back to template-driven forms.
