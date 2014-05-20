## PQ Angular Notification

### What is
Notification module working with AngularJS

### How to install

By Bower
`bower install pq-angular-notification`

### Dependencies
ng-animate

scss/css file with animates

### How to use it
1. You need to include  `pq.angular-notification.js` after AngularJS script.
2. Declare pq-angular-notification in your Angular aplication, like
```javascript
angular.module("app", ['pqNotification'])
```
3. If you want to change defaults settings inject $notification factory:
```javascript
run(function( $notification )
```
4. Add directive to your html view when notification should be show. Already you need to declare attribute name, for all of directive. Is necessary to distinguishing settings each directive.
```html
<pqnotification name="globalhandler"></pqnotification>
```

### Defaults settings
Src to notification template

```javascript
$notification.settings.templateUrl({
    error: 'notification/error.html',
    success: 'notification/success.html',
    info: 'notification/info.html',
    warning: 'notification/warning.html'
});
```

Behavior to remove notification elements

```javascript
$notification.settings.remove({
    click: true,
    timeout: false,
    time: 2000
});
```

#### Handlin http requests

If you want to handling error from all http requests, try below

```javascript
$notification.settings.httpHandler({
    included: true
});
```

### Animations

To use animations, add attribute to directive

```html
<pqnotification animate="slideUp"></pqnotification>
```

#### List of all animations

  - slideUp

### Todo
  - add support for default settings
  - improve docs
  - add demo
