import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Help  } from '../help'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeUser
 

  @Output() userNameEvent = new EventEmitter<string>();

  userName = '';



  setUserName(): void {
    this.userNameEvent.emit(this.userName);
  }




  constructor(private router:Router) { }
  user: Help = new Help()
  ngOnInit(): void {
    this.activeUser= localStorage.getItem("sender_email");
    if(this.activeUser){
      
      this.router.navigate(['/chat']);
    }
  }
  login(data){
   

    
  console.log(JSON.stringify(this.user))
  // localStorage.getItem("email");
  // localStorage.removeItem("email");

  if(this.user){
    if(this.user.email=="rishu0705" || this.user.email=="rijhu0705"  ){
      if(this.user.password=="123456"){
        localStorage.setItem("sender_email", this.user.email);
        this.router.navigate(['/chat']);
      }
      else{
        alert("your password is incorrect.!")
      }
    }
    else{
      alert("Please enter a valid email.!")
    }
  }
    // this.router.navigate(['/chat']);
  }

}
