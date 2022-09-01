import { Injectable } from '@angular/core';
import { Help, Chats} from '././help';

import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { delay, map, mergeAll, mergeMap, switchAll, switchMap,retry,catchError } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { interval, Subscription} from 'rxjs';
const SOCKET_ENDPOINT = "localhost:8000";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  chats: Chats[] = [];
  chat: Chats = new Chats();

  userName = '';
  message = '';
  activeUser="";
  messageList:any[] = [];
  userList: string[] = [];
  chats1: string[] = [];
  socket: any;
  // apiUrl="http://localhost:8000/"
  apiUrl="https://chatsender.herokuapp.com/"
//  apiUrl="https://rkplaza.herokuapp.com"
//  apiUrl=environment.apiURL
// apiUrl="";
//  userName=new BehaviorSubject<string>('Rishu')
  constructor(private http: HttpClient) { 

    this.activeUser= localStorage.getItem("sender_email");
   
    
    // this.socket = io.io(SOCKET_ENDPOINT+`/?userName=${this.activeUser}`);
    // this.userName = this.activeUser;
  
    // this.socket.emit('set-user-name', this.activeUser);
  
    // this.socket.on('user-list', (userList: string[]) => {
    //   this.userList = userList;
    // });
    // this.socket.on('output-message', (data) => {
    //   this.chats1 = data;
    //   console.log("from service"+ JSON.stringify(data))
    // });
  
    // this.socket.on('message-broadcast', (data) => {
    
    //   if (data) {
    //     console.log("all data="+JSON.stringify(data))
    //     this.messageList.push(data);
    //   }
    // });
  }

getMessage(){
  return  this.messageList;
}
getUserList(){
  return  this.userList;
}
getAllChats() :Observable<any[]> {
  console.log("comig to service")
  // return <any> this.chats;
  return <any>this.http.get( `${this.apiUrl}`+"/api/getAllChats/").pipe(map((Response: any) => Response))
}
  addChat(chats: any) {
    this.chats.push(chats);
    console.log(" from service= "+JSON.stringify(chats))
    this.http.post(`${this.apiUrl}`+"/api/addChats/", chats).subscribe();
  }
 
  callDisplay(){
    console.log("dispaly calling from service file")
    return <any>this.http.get("http://localhost:8080/api/display/").pipe(map((Response: any) => Response))
  }
 

removeProduct(items){
  console.log("coming.....")
  // this.http.delete("http://localhost:3000/myItems/"+id).subscribe();
  // this.http.post("http://localhost:8000/api/removeData/", items[0]).subscribe();
  this.http.post(`${this.apiUrl}`+"api/removeData/", items[0]).subscribe();
  }
 
 

}
