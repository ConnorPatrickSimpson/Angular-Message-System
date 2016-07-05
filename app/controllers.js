var controllers = angular.module('controllers', []);

controllers.controller('listCtrl', ['$scope', 'conversationService', 'listRepository',
    function ($scope, conversationService, listRepository) {
		listRepository.fetchList().then(
		    // Success
		    function(response) {
				$scope.conversations = response.data;
			}
		);
        $scope.setConv = function(conv_set) {
            conversationService.setConv(conv_set);
			$scope.conv_display = conversationService.getConv();
        };
	}
]);

controllers.controller('convCtrl', ['$scope', 'conversationService', 'conversationRepository',
    function ($scope, conversationService, conversationRepository) {
		var conv_display = conversationService.getConv();
        $scope.$watch(
		    function() {return conversationService.getConv()},
		    function(newValue) {
			    conversationRepository.fetchConv(newValue).then(
		            //Success
			        function(response) {
				        $scope.messages = response.data;
			        }
		        );
		    }
		);
		$scope.submitMess = function() {
			if ($scope.messages !== "undefined") {
			    conversationRepository.sendMess(conv_display, currentUser, $scope.messages, $scope.mess_submit);
			}
		};
	}
]);