
var client = angular.module('messageClient', []);

client.controller('listCtrl', ['$scope', 'conversationService', 
    function ($scope, conversationService) {
        // assign arbitrary array of conversation objects
        $scope.conversations = [
            {conv_id: 11111},
            {conv_id: 22222},
            {conv_id: 33333}
        ];
        $scope.setConv = function(conv_set) {
            conversationService.setConv(conv_set);
			$scope.conv_display = conversationService.getConv();
        };
	}
]);
	
client.factory('conversationService',
    function() {
        var conversationService = {};
		conversationService.conv_set = 'none';
			
        conversationService.setConv = function(conv_set) {
            this.conv_set = conv_set;
        };
        conversationService.getConv = function() {
            return this.conv_set;
        };
		
		return conversationService;
	}
);

client.factory('repositoryService'),
    function() {
		var repositoryService = {};
	}
);