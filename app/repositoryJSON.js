var repositories = angular.module('repositories', []);

repositories.factory('listRepository', ['$http',
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

repositories.factory('conversationRepository', ['$http',
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