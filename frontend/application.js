
var client = angular.module('messageClient', []);
var currentUser = "User 1";

client.controller('listCtrl', ['$scope', 'conversationService', 'listRepository',
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

client.controller('convCtrl', ['$scope', 'conversationService', 'conversationRepository',
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
	
client.factory('conversationService',
    function() {
        var conversationService = {};
		conversationService.conv_set;
			
        conversationService.setConv = function(conv_set) {
            this.conv_set = conv_set;
        };
        conversationService.getConv = function() {
            return this.conv_set;
        };
		
		return conversationService;
	}
);


client.factory('listRepository', ['$http',
    function($http) {
		var listRepository = {};
		
		listRepository.fetchList = function() {
			//temporary code to access local JSON file
			//used in lieu of backend REST API
			return $http.get('json/list.json');
		};
		
		return listRepository;
	}
]);

client.factory('conversationRepository', ['$http',
    function($http) {
		var conversationRepository = {};
				
		conversationRepository.fetchConv = function(conv_id) {
			//temporary code to access local JSON file
			//used in lieu of backend REST API
			var dir = 'json/';
			var url = dir.concat(conv_id, '.json');
			return $http.get(url);
		};
		
		conversationRepository.sendMess = function(conv_id, user, mess_list, mess_content) {
			//temporary code to modify messages object in $scope
			//used in lieu of backend REST API
			
			//This does not actually append to the local JSON object.
			//Apparently I need to use jQuery to do that, but fuck that.
			//This is for testing, so if I end up using .NET to create 
			//a backend, this code will be extraneous.
			var message = {"mess_id": 00, "mess_user": user, "mess_content": mess_content };
			mess_list.push(message);
		};
		
		return conversationRepository;
	}
]);