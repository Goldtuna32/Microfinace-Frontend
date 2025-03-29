import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotificationService } from 'src/app/demo/notification/notification.service';
import { Notification } from 'src/app/demo/notification/Notification.model';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/alertservice/alert.service';
import { FlowbiteService } from 'src/app/flowbite services/flowbit.service';
import { initFlowbite } from 'flowbite';
import { EmailService } from 'src/app/emailservice/email.service';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
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
export class NavRightComponent implements OnInit, OnDestroy {
  @ViewChild('notificationDropdown') notificationDropdown!: NgbDropdown;

  visibleEmailList: boolean = false; // Changed from visibleUserList to visibleEmailList
  notifications: Notification[] = [];
  showSuccessAlert: boolean = false;
  successMessage: string = '';
  emails: any[] = []; // Array to store emails
  private socket!: WebSocket; // WebSocket connection
  showComposeForm: boolean = false;
  emailTo: string = '';
  emailSubject: string = '';
  emailBody: string = '';
  

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private alertService: AlertService,
    private flowbiteService: FlowbiteService,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.connectWebSocket();
    this.loadEmailList();
    document.addEventListener('click', this.onClickOutside.bind(this));

    this.alertService.successAlert$.subscribe((message) => {
      this.successMessage = message;
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    });
  }

  toggleComposeForm(event: Event) {
    event.stopPropagation(); // Prevent toggling email list
    this.showComposeForm = !this.showComposeForm;
    if (!this.showComposeForm) {
      this.emailTo = '';
      this.emailSubject = '';
      this.emailBody = ''; // Reset form when closing
    }
  }

  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:8080/email-websocket');
    
    this.socket.onopen = (event) => {
        console.log('WebSocket connection established at:', new Date().toISOString(), event);
        // Send a ping to keep it alive
        this.socket.send('Ping from Angular');
    };
    

    this.socket.onmessage = (event) => {
      console.log('Received:', event.data);
      const emailData = JSON.parse(event.data);
      this.emails.unshift(emailData);
      
      this.cdr.detectChanges(); // Force UI update
    };
    
    this.socket.onclose = (event) => {
        console.log('WebSocket connection closed at:', new Date().toISOString(), 
            'Code:', event.code, 
            'Reason:', event.reason, 
            'Was clean:', event.wasClean, 
            'Remote:', event.wasClean ? 'Server' : 'Client or Network');
        setTimeout(() => this.connectWebSocket(), 2000); // Reconnect
    };
    
    this.socket.onerror = (error) => {
        console.error('WebSocket error at:', new Date().toISOString(), error);
    };
}

ngOnDestroy() {
    if (this.socket) {
        this.socket.close();
        console.log('WebSocket manually closed in ngOnDestroy');
    }
  }

  sendEmail() {
    if (this.emailTo && this.emailSubject && this.emailBody) {
      this.emailService.sendEmail(this.emailTo, this.emailSubject, this.emailBody).subscribe(
        (response) => {
          console.log(response);
          this.alertService.showSuccess('Email sent successfully!');
          this.emailTo = '';
          this.emailSubject = '';
          this.emailBody = ''; // Reset form
        },
        (error) => {
          console.error('Error sending email:', error);
          this.alertService.showError('Failed to send email');
        }
      );
    } else {
      this.alertService.showError('Please fill all email fields');
    }
  }

  loadEmailList() {
    this.emailService.getEmailList().subscribe(
      (emails) => {
        console.log('Received email list from backend:', emails); // Debug log
        this.emails = emails || []; // Ensure emails is an array, even if empty
        console.log('Updated emails array:', this.emails);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading email list:', error);
      }
    );
  }

  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const emailListElement = document.querySelector('.header-user-list');
    const emailToggleElement = document.querySelector('.displayChatbox');
  
    if (emailListElement && !emailListElement.contains(target) && emailToggleElement && !emailToggleElement.contains(target)) {
      this.visibleEmailList = false; // Close the email list
    }
  }

  refreshEmailList(event: Event) {
    event.stopPropagation();
    console.log('Refreshing email list');
    this.loadEmailList();
  }
toggleEmailList() {
  this.visibleEmailList = !this.visibleEmailList;
  console.log('Visible email list:', this.visibleEmailList);
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
      this.closeNotificationDropdown();
    }
  }

  dismissAlert() {
    this.showSuccessAlert = false;
  }

  // Remove chat-related methods since we're replacing with email list
  // onChatToggle(friendId: any) { ... }
}