

angular.module('messageClient.services')
    .service('conversationService', [ "temp",
        function(temp) {
            this.conv_set = "none";
            this.setConversation = function(temp) {
                this.conv_set = temp;
            };
            this.getConversation = function() {
                return this.conv_set;
            };
        }
    ]);