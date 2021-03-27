import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, AfterViewChecked {
  @Input() uid: string | undefined;
  @Input() captureStream: any;
  @Input() isMuted!: boolean;
  @Input() isStreaming!: boolean;


  @ViewChild('localVideo', {static: false}) public localVideo:any;

  user: any;

  constructor(private auth: AuthService) { }

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

  }

}
