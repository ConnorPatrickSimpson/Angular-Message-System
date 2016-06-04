

angular.module('messageClient.controllers')
    .controller('listCtrl', ['$scope',
        function ($scope) {
            // assign arbitrary array of conversation objects
            $scope.conversations = [
                {convo_id: 11111},
                {convo_id: 22222},
                {convo_id: 33333}
            ];
            $scope.chooseConversation = function(convo_id) {
                $scope.convo_select = convo_id;
            };
        }
    ]);