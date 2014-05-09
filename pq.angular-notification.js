    'use strict';

    (function() {

        angular.module('pqNotification.factory', ['ng'])
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
                                    timeout: false
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
                            $rootScope.$emit(name, inject);
                            $rootScope.$broadcast(name, inject);
                        };

                        var setup = function() {
                            var parameter;
                            var notificationType = ['success', 'info', 'warrning', 'error'];

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
                        settings: settings
                    };
                }
        );
        angular.module('pqNotification.directive', ['ng'])
            .directive('pqnotification', ['$notification',
                function($notification) {

                    var template;

                    var controller = function($scope, $notification) {
                        $scope.pqNotifications = [];
                        $notification.setup();
                    };

                    var link = function(scope, element, attrs) {

                        scope.$on('error', function() {
                            template = 'error?';
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

                    };


                    return {
                        restrict: 'E',
                        replace: true,
                        controller: controller,
                        template: '<div ng-include="getTemplateUrl()"></div>',
                        link: link
                    };

                }
            ])
            .directive('pqnotificationremove', [

                function() {

                    var link = function(scope, element, attrs) {
                        element.click(function() {
                            scope.pqNotifications.splice(element, 1);
                            scope.$apply();
                        });
                    };

                    return {
                        restrict: 'A',
                        link: link
                    };
                }
            ]);


        angular.module('pqNotification.setup', ['ng']).run(
            function($rootScope, $notification) {

                // $rootScope.$on('$viewContentLoaded', function() {
                //     $notification.setup();
                // });
            }
        );

        angular.module('pqNotification', ['pqNotification.factory', 'pqNotification.directive', 'pqNotification.setup']);

    })();