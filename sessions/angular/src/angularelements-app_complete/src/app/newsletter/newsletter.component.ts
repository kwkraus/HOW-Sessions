import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NewsletterService } from '../services/newsletter.service';

@Component({
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.css'],
    providers: [NewsletterService]
})
export class NewsLetterComponent {
    sub: PushSubscription;

    readonly VAPID_PUBLIC_KEY = 'BO_BCASJBfoVJ_DhdPsBU7nyXD9ZLuRR6_07Nve9zsTIWvULwrq3W0S6jXicSr2DC--OtP-gk1Sb5sgRAMbq640';

    constructor(
        private swPush: SwPush,
        private newsletterService: NewsletterService) {

    }

    subscribeToNotifications() {

        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        }).then(sub => {
            this.sub = sub;
            console.log('Notification Subscription: ', sub);
            this.newsletterService.addPushSubscriber(sub).subscribe(
                () => console.log('Sent push subscription object to server.'),
                err => console.log('Could not send subscription object to server, reason: ', err)
            );
        })
        .catch(err => console.error('Could not subscribe to notifications', err));
    }

    sendNewsletter() {
        console.log('Sending Newsletter to all Subscribers ...');
        this.newsletterService.send().subscribe();
    }
}

