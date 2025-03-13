// angular import
import { Component, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap import
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { NotificationService } from 'src/app/demo/notification/notification.service';
import { Notification } from 'src/app/demo/notification/Notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, ChatUserListComponent, ChatMsgComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent {
  @ViewChild('notificationDropdown') notificationDropdown!: NgbDropdown;

  visibleUserList: boolean = false;
  chatMessage: boolean = false;
  friendId!: number;
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router // Inject Router
  ) {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getAllUnreadNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  sendTestNotification() {
    this.notificationService.sendNotification(1, 'INFO', 'This is a test notification', 1).subscribe(() => {
      this.loadNotifications();
    });
  }

  closeNotificationDropdown() {
    if (this.notificationDropdown) {
      this.notificationDropdown.close();
    }
  }

  navigateToPendingLoans(notification: Notification) {
    if (notification.type === 'PENDING_LOAN') {
      this.router.navigate(['/loan/list']);
      this.closeNotificationDropdown(); // Close dropdown after navigation
    }
  }

  onChatToggle(friendId: any) {
    this.friendId = friendId;
    this.chatMessage = !this.chatMessage;
  }
}
