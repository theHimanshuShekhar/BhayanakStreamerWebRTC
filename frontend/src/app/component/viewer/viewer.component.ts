import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() uid: string | undefined;

  user: any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    if(this.uid) {
      this.auth.getUserWithUID(this.uid).subscribe(user => {
        this.user = user;
      })
    }
  }

}
