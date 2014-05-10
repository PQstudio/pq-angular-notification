## PQ Angular Notification

### What is
Notification module working with AngularJS

### How to install

by Bower
`bower install pq-angular-notification`

### How to use it
1. You need to include  `pq.angular-notification.js` after AngularJS script.
2. Declare pq-angular-notification in your Angular aplication, like
`angular.module("app", ['pqNotification'])`
3. If you want to change defaults settings inject $notification factory:
`.run(function($notification)`
4. Add directive to your html view when notification should be show `<pqnotification></pqnotification>`

### Defaults settings
    $notification.settings.templateUrl({
        error: 'notification/error.html',
        success: 'notification/success.html',
        info: 'notification/info.html',
        warning: 'notification/warning.html'
    });


    $notification.settings.remove({
        click: true,
        timeout: false,
        time: 2000
    });


### Todo
  - ng-repeat compile before include template
  - add few defaults notification styles
  - add animate for show ang hide before remove element from scope
  - add settings for animate
