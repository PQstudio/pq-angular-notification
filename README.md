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


### Very important
All of settings must be in .run and $on viewContentLoaded. 

Example:
```javascript
angular.module("app", ['pqNotification', 'ngAnimate'])
  .run(function($rootScope, $notification) {

    $rootScope.$on('$viewContentLoaded', function() {

      $notification.declaredName.adshandler.httpStatus({
        400: {
          type: 'error',
          message: "Nowy message"
        }
      });

      $notification.declaredName.globalserver.httpHandler({
        included: false
      });

      $notification.declaredName.globalserver.templateUrl({
        template: 'notification/errorglobalserver.html'
      });

    });



  });
```


### Defaults settings
Src to notification template

```javascript
    template: 'notification/error.html'
```

Behavior to remove notification elements

```javascript
    click: true,
    timeout: false,
    time: 2000
```

#### Handling http requests

If you want to handling error from all http requests, try below
nameofdirective is your declared attribute name
```javascript
$notification.declaredname.nameofdirective.defaults.httpHandler({
    included: true
});
```

### Animations

To use animations, add attribute to directive

```html
<pqnotification animate="slideVerticalUp"></pqnotification>
```

### Remove event
Inside directive can be whatever you want.
```html
<pqnotificationremove="examplenotification">x</pqnotificationremove>
```

#### List of all animations

  - slideVerticalUp
  - slideVerticalDown

### Todo
  - add support for default settings
  - improve docs
  - add demo
