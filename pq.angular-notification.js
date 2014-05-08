    'use strict';

    (function() {

        angular.module('pqNotification.factory', ['ng'])
            .factory('$notification',
                function($rootScope) {

                    try {

                        var type = 0;
                        var notificationType = [];

                        var settings = {
                            templateUrlError: '/templates/notification/error.html',
                            templateUrlSuccess: '',
                            templateUrlWarning: ''
                        };

                        var pushNotificationType = function(string) {
                            return notificationType.push(string);
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
                                        return $rootScope.message = callback;
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
                        pushNotificationType: pushNotificationType,
                        setup: setup,
                        call: call,
                        settings: settings
                    };
                }
        );
        angular.module('pqNotification.directive.error', ['ng']).directive('notificationerror', ['$notification',
            function($notification) {

                var controller = function($scope, $notification) {
                    $notification.pushNotificationType('error');;
                };

                var link = function(scope, element, attrs) {
                    scope.$on('error', function() {
                        element.parent().append("<div class='notification'><p><span style='font-weight: bold'>Błąd: </span>" + scope.message + "</p></div>");
                    });
                };


                return {
                    restrict: 'E',
                    replace: true,
                    // templateUrl: 'notification/error.html',
                    controller: controller,
                    link: link
                };

            }
        ]);


        angular.module('pqNotification.setup', ['ng']).run(
            function($rootScope, $notification) {
                $rootScope.$on('$viewContentLoaded', function() {
                    $notification.setup();
                    console.log($notification.settings);

                });
            }
        );

        angular.module('pqNotification', ['pqNotification.factory', 'pqNotification.directive.error', 'pqNotification.setup']);

    })();