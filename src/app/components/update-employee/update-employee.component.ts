import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../form.service';
import { AppComponent } from '../../app.component';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports:[AppComponent,NgClass,NgFor,NgIf,ReactiveFormsModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent {
  employeeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      phone: [data.phone, [Validators.required]],
      address: [data.address, Validators.required],
      description: [data.description, Validators.required],
      salary: [data.salary, Validators.required]
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.calBonus();
      const updatedEmployee = { ...this.data, ...this.employeeForm.value };
      this.dialogRef.close(updatedEmployee);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  calBonus(){
    const bonusemp: Employee = this.employeeForm.value;
    bonusemp.bonus=bonusemp.salary*0.1;
  }
}
