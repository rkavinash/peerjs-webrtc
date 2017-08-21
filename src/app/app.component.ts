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
  @ViewChild('theirVideo') theirVideo: any;
  peer: any;
  anotherPeersId: any;
  myPeerId: any;

  constructor() {
  }

  ngOnInit() {
      const myVideo = this.myVideo.nativeElement;
      const theirVideo = this.theirVideo.nativeElement;
      this.peer = new Peer({　host: 'ark-peerjs-server.herokuapp.com', secure: true, port: 443, key: 'peerjs', debug: 3})

      setTimeout(() => {
        this.myPeerId = this.peer.id;
      }, 3000);

      this.peer.on('connection', function(conn) {
        conn.on('data', function(data){
          // Will print 'hi!'
          console.log(data);
        });
      });

      const n = <any> navigator;
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

      n.getUserMedia({audio: true, video: true}, function(stream) {
        myVideo.src = URL.createObjectURL(stream);
      }, function(err) {
          console.log('Failed to get local stream', err);
      });

      this.peer.on('call', (call) => {
        n.getUserMedia({video: true, audio: true}, function(stream) {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream) => {
            theirVideo.src = URL.createObjectURL(remoteStream);
          });
        }, function(err) {
          console.log('Failed to get remote stream', err);
        });
      });
  }

  videoCall() {
      const theirVideo = this.theirVideo.nativeElement;
      const n = <any> navigator;
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

      n.getUserMedia({video: true, audio: true}, (stream) => {
        const call = this.peer.call(this.anotherPeersId, stream);
        call.on('stream', (remoteStream) => {
          console.log('teiir video called');
          theirVideo.src = URL.createObjectURL(remoteStream);
        });
      }, function(err) {
        console.log('Failed to get remote stream', err);
      });
  }

  endVideoCall() {
    this.peer.on('destroy', () => {
      console.log('destroy');
      }, function(err) {
        console.log('Failed to close remote stream', err);
      });
  }

}
