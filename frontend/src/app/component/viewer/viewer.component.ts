import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConnectionService } from 'src/app/services/connection/connection.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, AfterViewChecked {
  @Input() uid!: string ;
  @Input() captureStream: any;
  @Input() isMuted!: boolean;
  @Input() isStreaming?: boolean;
  @Input() currentUID?: string ;
  @Input() roomID?: string;


  @ViewChild('localVideo', {static: false}) public localVideo:any;

  user: any;

  constructor(private auth: AuthService, private connection: ConnectionService) { }

  ngOnInit(): void {
    if(this.uid) {
      this.auth.getUserWithUID(this.uid).subscribe(user => {
        this.user = user;
      })
    }
  }

  ngAfterViewChecked() {
    if(this.localVideo && this.captureStream) this.localVideo.nativeElement.srcObject = this.captureStream;
  }

  joinStream() {
    // Establish connection with user using UID
    if(this.currentUID && this.roomID) {
      this.connection.offerConnection(this.uid, this.currentUID, this.roomID).then(pc => {
        console.log(pc);
        // Pull tracks from remote stream, add to video stream
        pc.ontrack = this.getOnTrackCallback()
      });
    }
  }

  private getOnTrackCallback()  {
    console.log("onTrack Callback called")
    return (event: RTCTrackEvent) => {
      console.log("Add track to captureStream")
      event.streams[0].getTracks().forEach((track: any) => {
        this.captureStream.addTrack(track);
        console.log("Added track to captureStream")
      });
    };
  }

}
