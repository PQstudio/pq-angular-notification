## PQ Angular Notification

### What is
Notification module working with AngularJS


### How to install

by Bower
`bower install pq-angular-notification`

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
