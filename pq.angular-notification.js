    'use strict';

    (function() {

        angular.module('pqNotification.factory', ['ng', 'ngAnimate'])
            .factory('$notification',
                function($rootScope) {

                    try {

                        var type = 0;
                        var notificationType = [];
                        var declaredName = {};

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
                                },
                                httpStatus: {},
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
                            httpStatus: function(obj) {
                                if (typeof obj === 'object') {
                                    for (status in obj) {
                                        this.defaults.httpStatus[status] = obj[status];
                                    }
                                }
                            },
                            animate: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaults.animate.included = obj.hasOwnProperty('included') ? obj.included : this.defaults.animate.included;
                                    this.defaults.animate.behavior = obj.hasOwnProperty('behavior') ? obj.behavior : this.defaults.animate.behavior;
                                }
                            }

                        };

                        // Trying to make dynamic directive settings each for directive
                        var declare = function(string) {
                            declaredName[string] = settings;
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
                            // should be dynamic
                            var notificationType = ['success', 'info', 'warning', 'error', 'error-globalserver'];

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
                        declare: declare,
                        declaredName: declaredName,
                        settings: settings,
                        defaults: settings.defaults
                    };
                }
        );


        angular.module('pqNotification.directive', ['ng'])
            .directive('pqnotification', ['$notification',
                function($notification, $compile) {

                    var animate;

                    var controller = function($scope, $notification) {
                        $scope.pqNotifications = {};
                        $notification.setup();
                    };

                    var template = function(element, attrs) {
                        return '<div class="animated animated-'+ attrs.animate +'" ng-repeat="pqnotification in '+ attrs.name+' track by $index" ng-include="getTemplateUrl()"></div>';
                    }

                    var link = function(scope, element, attrs) {
                        var escape = 27;
                        animate = attrs.animate;
                        var name = attrs.name;
                        $notification.declare(name);

                        if (name) {
                            scope[name] = [];

                            scope.$on('error-' + name, function() {
                                scope[name].push({
                                    title: "Błąd",
                                    message: scope.pqnotificationmessage
                                });
                               
                            });

                            scope.$on('success-' + name, function() {
                                scope.pqNotifications[name].push({
                                    title: "Udało się",
                                    message: scope.pqnotificationmessage
                                })
                            });
                        }



                        $('body').bind('keydown', function(e) {
                            if (scope[name].length !== 0 && e.keyCode === escape) {
                                scope.$apply(function() {
                                    scope[name].splice(element, 1);
                                });
                            }
                        });



                        scope.getTemplateUrl = function() {
                            return $notification.settings.defaults.template.error;
                        };

                    };


                    return {
                        restrict: 'E',
                        replace: true,
                        controller: controller,
                        template: template,
                        link: link
                    };

                }
            ])
            .directive('pqnotificationremove', ['$notification', '$timeout',
                function($notification, $timeout) {
                    var link = function(scope, element, attrs, a) {
                        console.log(a);
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
                    var included = $notification.defaults.httpHandler.included,
                        codeStatus = $notification.defaults.httpStatus,
                        names = $notification.declaredName,
                        name,
                        status;

                    var response = function(response) {
                        return response || $q.when(response);
                    };

                    var responseError = function(rejection) {
                        for(name in names) {
                            console.log(names[name]);
                        }

                        for (status in codeStatus) {
                            status = parseInt(status);
                            if (rejection.status === status && codeStatus[status] !== (false || true)) {
                                $notification.call('error-globalserver', codeStatus[status]);
                            } else if (rejection.status === status && codeStatus[status] === true) {
                                $notification.call('error-globalserver', rejection.status + ' ' + rejection.statusText);
                                $notification.call('error-adshandler', rejection.status + ' ' + rejection.statusText);
                            }
                        };
                        return $q.reject(rejection);
                    };


                    if (included) {
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