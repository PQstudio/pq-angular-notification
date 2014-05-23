    'use strict';

    (function() {

        angular.module('pqNotification.factory', ['ng', 'ngAnimate'])
            .factory('$notification',
                function($rootScope) {

                    try {

                        var type = 0;
                        var notificationType = [];
                        var declaredName = {};
                        var notificationType = ['success', 'info', 'warning', 'error'];
                        var stringCallback = "nie pierdole sie, grejfrut";


                        var settings = {
                            defaults: {
                                template: 'notification/error.html',
                                title: {
                                    error: 'Error',
                                    success: 'Success',
                                    warning: 'Warning',
                                    info: 'Info'
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
                                    this.defaults.template = obj.hasOwnProperty('template') ? obj.template : this.defaults.template;
                                }
                            },
                            title: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaults.title.error = obj.hasOwnProperty('error') ? obj.error : this.defaults.title.error;
                                    this.defaults.title.success = obj.hasOwnProperty('success') ? obj.success : this.defaults.title.success;
                                    this.defaults.title.warning = obj.hasOwnProperty('warning') ? obj.warning : this.defaults.title.warning;
                                    this.defaults.title.info = obj.hasOwnProperty('info') ? obj.info : this.defaults.title.info;
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

                        var addNotificationType = function(string) {
                            notificationType.push('error-' + string);
                            notificationType.push('success-' + string);
                            notificationType.push('info-' + string);
                            notificationType.push('warning-' + string);
                        };
                        // Trying to make dynamic directive settings each for directive
                        var declare = function(string) {
                            addNotificationType(string);
                            declaredName[string] = {};
                            angular.copy(settings, declaredName[string]);
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

                            if (notificationType.length === 0) {
                                throw new Error("You should give some setup names in arguments NotificationService.setup()");
                            }
                            var that = this;
                            var onFunction = function(notificationType) {
                                $rootScope.$on(notificationType, function(event, callback) {
                                    return that.stringCallback = callback;
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
                        addNotificationType: addNotificationType,
                        settings: settings,
                        defaults: settings.defaults,
                        stringCallback: stringCallback
                    };
                }
        );


        angular.module('pqNotification.directive', ['ng'])
            .directive('pqnotification', ['$notification',
                function($notification, $compile) {

                    var animate;

                    var controller = function($scope, $notification) {
                        $scope.pqNotifications = {};
                    };

                    var template = function(element, attrs) {
                        $notification.declare(attrs.name);
                        var animate;
                        if (attrs.animate) {
                            animate = 'animated animated-' + attrs.animate;
                        }

                        return '<div class="' + animate + '" ng-repeat="pqnotification in ' + attrs.name + ' track by $index" ng-include="getTemplateUrl()"></div>';
                    }

                    var link = function(scope, element, attrs) {
                        var escape = 27;
                        var name = attrs.name;
                        $notification.setup();
                        if (name) {
                            scope[name] = [];


                            scope.$on('error-' + name, function() {
                                scope[name].push({
                                    type: 'error',
                                    title: $notification.declaredName[name].defaults.title.error,
                                    message: $notification.stringCallback
                                });
                            });

                            scope.$on('success-' + name, function() {
                                scope[name].push({
                                    type: 'success',
                                    title: $notification.declaredName[name].defaults.title.success,
                                    message: $notification.stringCallback
                                });
                            });

                            scope.$on('info-' + name, function() {
                                scope[name].push({
                                    type: 'info',
                                    title: $notification.declaredName[name].defaults.title.info,
                                    message: $notification.stringCallback
                                });
                            });

                            scope.$on('warning-' + name, function() {
                                scope[name].push({
                                    type: 'warning',
                                    title: $notification.declaredName[name].defaults.title.warning,
                                    message: $notification.stringCallback
                                });
                            });
                        }


                        //should be working better
                        // $('body').bind('keydown', function(e) {
                        //     if (scope[name].length !== 0 && e.keyCode === escape) {
                        //         scope.$apply(function() {
                        //             scope[name].splice(element, 1);
                        //         });
                        //     }
                        // });



                        scope.getTemplateUrl = function() {
                            return $notification.declaredName[name].defaults.template;
                        };

                    };


                    return {
                        restrict: 'E',
                        replace: true,
                        scope: {
                            getTemplateUrl: '&'
                        },
                        controller: controller,
                        template: template,
                        link: link
                    };

                }
            ])
            .directive('pqnotificationremove', ['$notification', '$timeout',
                function($notification, $timeout) {
                    var link = function(scope, element, attrs) {
                        var settings = $notification.settings.defaults.remove;
                        if ($notification.declaredName[attrs.pqnotificationremove].defaults.remove.click) {
                            element.click(function() {
                                scope.$apply(function() {
                                    scope.$parent.this[attrs.pqnotificationremove].splice(scope.$index, 1);
                                });
                            });
                        }
                        if ($notification.declaredName[attrs.pqnotificationremove].defaults.remove.timeout) {
                            for (var i = 0; i < scope.this[attrs.pqnotificationremove].length; i++) {
                                $timeout(function() {
                                    scope.$apply(function() {
                                        scope.this[attrs.pqnotificationremove].splice(scope.$index, 1);
                                    })
                                }, $notification.declaredName[attrs.pqnotificationremove].defaults.remove.time)
                            }

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
                        for (name in names) {
                            (function(e) {
                                for (status in names[e].defaults.httpStatus) {
                                    status = parseInt(status);


                                    if (rejection.status === status && names[e].defaults.httpStatus[status] !== (false || true)) {
                                        if (names[e].defaults.httpStatus[status].type === "error") {
                                            $notification.call('error-' + e, names[e].defaults.httpStatus[status].message);
                                        } else if (names[e].defaults.httpStatus[status].type === "success") {
                                            $notification.call('success-' + e, names[e].defaults.httpStatus[status].message);
                                        }
                                    } else if (rejection.status === status && names[e].defaults.httpStatus[status] === true) {
                                        $notification.call('error-' + e, rejection.status + ' ' + rejection.statusText);
                                    }

                                };
                            })(name)


                        }
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