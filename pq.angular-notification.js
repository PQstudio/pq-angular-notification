    'use strict';

    (function() {

        angular.module('pqNotification.factory', ['ng', 'ngAnimate'])
            .factory('$notification',
                function($rootScope) {

                    try {

                        var type = 0;
                        var notificationType = [];


                        var settings = {
                            defaults: {
                                template: {
                                    error: 'notification/error.html',
                                    success: 'notification/success.html',
                                    info: 'notification/info.html',
                                    warning: 'notification/warning.html'
                                },
                                remove: {
                                    click: true,
                                    timeout: false,
                                    time: 2000
                                },
                                httpHandler: {
                                    included: true,
                                    200: false,
                                    201: false,
                                    400: false,
                                    401: false,
                                    500: false
                                },
                                animate: {
                                    included: true,
                                    behavior: "fade"
                                }

                            },
                            templateUrl: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaults.template.error = obj.hasOwnProperty('error') ? obj.error : this.defaults.template.error;
                                    this.defaults.template.success = obj.hasOwnProperty('success') ? obj.success : this.defaults.template.success;
                                    this.defaults.template.info = obj.hasOwnProperty('info') ? obj.info : this.defaults.template.info;
                                    this.defaults.template.warning = obj.hasOwnProperty('warning') ? obj.warning : this.defaults.template.warning;
                                }
                            },
                            remove: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaults.remove.click = obj.hasOwnProperty('click') ? obj.click : this.defaults.remove.click;
                                    this.defaults.remove.timeout = obj.hasOwnProperty('timeout') ? obj.timeout : this.defaults.remove.timeout;
                                    this.defaults.remove.time = obj.hasOwnProperty('time') ? obj.time : this.defaults.remove.time;
                                }
                            },
                            httpHandler: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaults.httpHandler.included = obj.hasOwnProperty('included') ? obj.included : this.defaults.httpHandler.included;
                                }
                            },
                            animate: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaults.animate.included = obj.hasOwnProperty('included') ? obj.included : this.defaults.animate.included;
                                    this.defaults.animate.behavior = obj.hasOwnProperty('behavior') ? obj.behavior : this.defaults.animate.behavior;
                                }
                            }

                        };


                        /**
                     * @ngdoc method
                     * @name Notification.NotificationService#call
                     * @methodOf Notification.NotificationService
                     * @description
                     * method
                     * @param {String} name Is name of calling notification e.g Error, Success
                     * @param {Function | String} inject
                     * Function: 
                     * Injected function will call when notification has induced
                     *
                     * String
                     * String will display when notification has called
                     
                     **/
                        var call = function(name, inject) {
                            $rootScope.$broadcast(name, inject);
                        };

                        var setup = function() {
                            var parameter;
                            var notificationType = ['success', 'info', 'warning', 'error'];

                            if (notificationType.length === 0) {
                                throw new Error("You should give some setup names in arguments NotificationService.setup()");
                            }

                            var onFunction = function(notificationType) {

                                $rootScope.$on(notificationType, function(event, callback) {
                                    type = typeof callback;
                                    if (type === "function") {
                                        return callback();
                                    } else if (type === "string") {
                                        $rootScope[notificationType] = callback;
                                        return $rootScope.pqnotificationmessage = callback;
                                    }
                                });

                            };

                            for (var j in notificationType) {
                                if (notificationType.hasOwnProperty(j)) {
                                    parameter = notificationType[j];
                                    onFunction(parameter);
                                }
                            }

                        };

                    } catch (e) {
                        throw new Error(e.message);
                    }

                    return {
                        setup: setup,
                        call: call,
                        settings: settings,
                        defaults: settings.defaults
                    };
                }
        );


        angular.module('pqNotification.directive', ['ng'])
            .directive('pqnotification', ['$notification',
                function($notification) {

                    var template;
                    var animate;

                    var controller = function($scope, $notification) {
                        $scope.pqNotifications = [];
                        $notification.setup();
                    };

                    var link = function(scope, element, attrs) {

                        animate = attrs.animate;

                        console.log(animate);

                        scope.$on('error', function() {
                            scope.pqNotifications.push({
                                title: "Błąd",
                                message: scope.pqnotificationmessage
                            });

                        });

                        scope.$on('success', function() {
                            scope.pqNotifications.push({
                                title: "Udało się",
                                message: scope.pqnotificationmessage
                            })
                        });

                        scope.getTemplateUrl = function() {
                            return $notification.settings.defaults.template.error;
                        };

                        if(animate !== undefined) {
                            scope.pqnotificationanimate = animate;
                        }

                    };


                    return {
                        restrict: 'E',
                        replace: true,
                        controller: controller,
                        template: '<div class="animated {{pqnotificationanimate}}" ng-repeat="pqnotification in pqNotifications" ng-include="getTemplateUrl()"></div>',
                        link: link
                    };

                }
            ])
            .directive('pqnotificationremove', ['$notification', '$timeout',
                function($notification, $timeout) {
                    var link = function(scope, element, attrs) {
                        var settings = $notification.settings.defaults.remove;
                        if (settings.click) {
                            element.click(function() {
                                scope.$apply(function() {
                                    scope.pqNotifications.splice(scope.$index, 1);
                                });
                            });
                        }
                        if (settings.timeout) {
                            $timeout(function() {
                                scope.$apply(function() {
                                    scope.pqNotifications.splice(scope.$index, 1);
                                })
                            }, settings.time)
                        }

                    };

                    return {
                        restrict: 'A',
                        link: link
                    };
                }
            ]);


        angular.module('pqNotification.setup', ['ng']).config(
            function($httpProvider, $provide) {

                $provide.factory('httpHandler', function($q, $notification) {
                    var defaults = $notification.defaults;

                    var response = function(response) {
                        return response || $q.when(response);
                    };

                    var responseError = function(rejection) {
                        // if(rejection.status === 400) {
                        $notification.call('error', rejection.status + ' ' + rejection.statusText);
                        // }
                        return $q.reject(rejection);
                    };


                    if (defaults.httpHandler.included) {
                        return {
                            'response': response,
                            'responseError': responseError
                        };
                    } else {
                        return {
                            'request': function(config) {
                                return config;
                            }
                        }
                    }

                });

                $httpProvider.interceptors.push('httpHandler');


            }
        );

        angular.module('pqNotification', ['pqNotification.factory', 'pqNotification.directive', 'pqNotification.setup']);

    })();