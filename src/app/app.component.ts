import { Component, OnInit, ViewChild } from '@angular/core';
import * as Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Web RTC module';

  @ViewChild('myVideo') myVideo: any;
  peer: any;
  anotherPeersId: any;
  myPeerId: any

  constructor() {
  }

  ngOnInit() {
      const video = this.myVideo.nativeElement;
      this.peer = new Peer({　host: 'ark-peerjs-server.herokuapp.com', secure: true, port: 443, key: 'arkpeerjs', debug: 3})

      setTimeout(() => {
        this.myPeerId = this.peer.id;
      }, 2000);

      this.peer.on('connection', function(conn) {
        conn.on('data', function(data){
          // Will print 'hi!'
          console.log(data);
        });
      });

      const n = <any> navigator;
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
      this.peer.on('call', (call) => {
        n.getUserMedia({video: true, audio: true}, function(stream) {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream) => {
            // Show stream in some video/canvas element.
            video.src = URL.createObjectURL(remoteStream);
            video.play();
          });
        }, function(err) {
          console.log('Failed to get local stream', err);
        });
      });
  }

  connect() {
    const conn = this.peer.connect(this.anotherPeersId);
    conn.on('open', function(){
      conn.send('hi............!');
    });
  }

  videoConnect() {
      const video = this.myVideo.nativeElement;
      const n = <any> navigator;
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

      n.getUserMedia({video: true, audio: true}, (stream) => {
        const call = this.peer.call(this.anotherPeersId, stream);
        call.on('stream', (remoteStream) => {
          // Show stream in some video/canvas element.
          video.src = URL.createObjectURL(remoteStream);
          video.play();
        });
      }, function(err) {
        console.log('Failed to get local stream', err);
      });
  }

}
