    'use strict';

    (function() {

        angular.module('pqNotification.factory', ['ng'])
            .factory('$notification',
                function($rootScope) {

                    try {

                        var type = 0;
                        var notificationType = [];


                        var settings = {
                            defaultTemplate: {
                                error: 'notification/error.html',
                                success: 'notification/success.html',
                                info: 'notification/info.html',
                                warning: 'notification/warning.html'
                            },
                            templateUrl: function(obj) {
                                if (typeof obj === 'object') {
                                    this.defaultTemplate.error = obj.error ? obj.error : this.defaultTemplate.error;
                                    this.defaultTemplate.success = obj.success ? obj.success : this.defaultTemplate.success;
                                    this.defaultTemplate.info = obj.info ? obj.info : this.defaultTemplate.info;
                                    this.defaultTemplate.warning = obj.warning ? obj.warning : this.defaultTemplate.warning;
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
                            console.log(name);
                            console.log(inject);
                            $rootScope.$emit(name, inject);
                            $rootScope.$broadcast(name, inject);
                        };

                        var setup = function() {
                            var parameter;
                            var notificationType = ['success', 'info', 'warrning', 'error'];
                            $rootScope.pqNotifications = [];


                            console.log(notificationType);

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
                                parameter = notificationType[j];
                                console.log(parameter);
                                onFunction(parameter);
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
        angular.module('pqNotification.directive', ['ng']).directive('notification', ['$notification',
            function($notification) {

                var template;

                var controller = function($scope, $notification) {
                    $notification.setup();
                };

                var link = function(scope, element, attrs) {

                    console.log($notification.settings.defaultTemplate);

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
                        return $notification.settings.defaultTemplate.error;
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