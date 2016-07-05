var services = angular.module('services', []);

services.factory('conversationService',
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