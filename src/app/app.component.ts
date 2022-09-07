import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IProduct } from './app.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'demo1';
   // form: FormGroup;
   Add = false;
   loading = false;
   submitted = false;
   panelOpenState: any;
   message = "";
   mainList : IProduct[] =[];

   form = new FormGroup({
    userId: new FormControl('',{validators:[Validators.required]}),
    id: new FormControl(null),
    title: new FormControl('',{validators:[Validators.required]}),
    body: new FormControl('',{validators:[Validators.required]})
   })
   constructor(private http:HttpClient) { }

   ngOnInit(): void {

       this.http.get<IProduct[]>(environment.url).subscribe((data:IProduct[]) => {
          this.mainList = data;
       })
    this.message = "";
   }

   add(){
    this.Add = !this.Add;
   }

   OnUpdate(id:number){
    this.Add = true;
    let x :any = this.mainList.find(x => x.id == id);
    this.form.controls['id'].setValue(x.id);
    this.form.controls['userId'].setValue(x.userId);
    this.form.controls['title'].setValue(x.title);
    this.form.controls['body'].setValue(x.body);
   }

   OnDelete(id:number){
    console.log(environment.url+"/"+id)
      this.http.delete(environment.url+"/"+id).subscribe((data:any) => {
        console.log(data);
        //this.mainList = this.mainList.filter(x => x.id != id);
        this.mainList = this.mainList.filter(x => x.id != id);
        console.log(this.mainList)
      })
   }
   onSubmit(){
     this.submitted = true;
     if (this.form.invalid) {
      return;
  }

     this.loading = true;

     let allItems :IProduct = {

      id: this.form.get('id')?.value,
      userId: this.form.get('userId')?.value,
      title: this.form.get('title')?.value,
      body: this.form.get('body')?.value
    }
    console.log(allItems);

   if(allItems.id == null){
    this.http.post<IProduct>(environment.url,allItems).subscribe((data:IProduct) => {
      console.log(data);
      let x:any[] = this.mainList.map(x => x.id);
      data.id = Math.max(...x) + 1;
      this.mainList.push(data);
      console.log(this.mainList);
      this.Add = false;
      this.loading = false;
    } )
   }
   else{
    this.http.patch<IProduct>(environment.url+"/"+allItems.id,allItems).subscribe((data:IProduct) => {
      console.log(data);
      let objIndex = this.mainList.findIndex((obj => obj.id == allItems.id));
      this.mainList[objIndex] = allItems;
      this.Add = false;
      this.loading = false;
    })
   }
   this.form.reset();
   }
 }

