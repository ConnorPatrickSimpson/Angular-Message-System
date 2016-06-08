

angular.module('messageClient.controllers')
    .controller('listCtrl', ['$scope', 'conversationService',
        function ($scope, conversationService) {
            // assign arbitrary array of conversation objects
            $scope.conversations = [
                {conv_id: 11111},
                {conv_id: 22222},
                {conv_id: 33333}
            ];
            $scope.setConversation = function(conv_set) {
                conversationService.setConversation(conv_set);
            };
            $scope.conv_display = conversationService.getConversation();
        }
    ]);