import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Web RTC module';
  peer: any;
  anotherPeersId: any;
  myPeerId: any

  constructor() {
  }

  ngOnInit() {
    this.peer = new Peer({key: '6cyvr39go3kdquxr'});

    setTimeout(() => {
      this.myPeerId = this.peer.id;
    }, 3000);

    this.peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
});
  }

  connect() {
    const conn = this.peer.connect(this.anotherPeersId);
    conn.on('open', function(){
      conn.send('hi!');
    });
  }

}
