angular.module('client.repositories')
    .service('conversationsSingletonService', [function(){

            var currentUser = "";
            var currentConversation = "";
            var currentListOfConversations = [];

            //Selected User
            var getCurrentUser = function () {
                return currentUser;
            };
            var setCurrentUser = function(id){
                currentUser = id;
                return currentUser;
            };
            //List of conversations
            var getListOfConversations = function () {
                return currentListOfConversations;
            };
            var setListOfConversations = function(listOfConvos)
            {
                currentListOfConversations = listOfConvos;
                return currentListOfConversations;
            };
            //Current Conversation
            var getCurrentConversation = function () {
                return  currentConversation;
           };
           var setCurrentConversation = function (conversationID) {
                currentConversation = conversationID;
                return  currentConversation;
           };
            
            // User Repository Functions
            return {
                // get|set      User
                getUser: getCurrentUser,
                setUser: setCurrentUser,
                // get|set      List of conversations
                getConvos: getListOfConversations,
                setConvos: setListOfConversations,
                // get|set      Current Conversation
                getConvo: getCurrentConversation,
                setConvo: setCurrentConversation
            };
    }]);


var serviceBus = 'https://utd-instant-message.servicebus.windows.net/';
// Conversation Repository
angular.module('client.repositories')
    .service('conversationRepository', ['$http',
        function ($http) {
            var getConversationAllImpl = function () {
                var url = serviceBus.concat('api/conversation/all');
                return $http.get(url);
            };
            var getUserConversationAllImpl = function (userID) {
                var url = serviceBus.concat('api/conversation/all/user/', userID);
                return $http.get(url);
            };
            var createNewConversationImpl = function (conversationObject) {
                var url = serviceBus.concat('api/conversation');
                return $http.post(url, conversationObject);
            };


            // Conversation Repository Functions
            return {
                // getConversationAll()
                getConversationAll: getConversationAllImpl,
                // getUserConversationAll(userID)
                getUserConversationAll: getUserConversationAllImpl,
                // createNewConversation(conversationObject)
                createNewConversation: createNewConversationImpl
            };
        }
    ]);

// Message Repository
angular.module('client.repositories')
    .service('messageRepository', ['$http',
        function ($http) {
            var getMessagesAllImpl = function (conversationID) {
                var url = serviceBus.concat('api/message/', conversationID, '/all');
                return $http.get(url);
            };
            var getMessagesPagedImpl = function (conversationID) {
                var url = serviceBus.concat('api/message/', conversationID, '/all');
                return $http.get(url);
            };
            var createMessageImpl = function (messageObject, conversationID) {
                var url = serviceBus.concat('api/message/', conversationID);
                return $http.post(url, messageObject);
            };

            // Message Repository Functions
            return {
                // getMessagesAll(conversationID)
                getMessagesAll: getMessagesAllImpl,
                // getMessagesPaged(conversationID)
                getMessagesPaged: getMessagesPagedImpl,
                // createMessage(messageObject, conversationID)
                createMessage: createMessageImpl
            };
        }
    ]);

// User Repository  
angular.module('client.repositories')
    .service('userRepository', ['$http',
        function ($http) {
            var getUsersImpl = function () {
                var url = serviceBus.concat('api/users');
                return $http.get(url);
            };

            // User Repository Functions
            return {
                // getUsers()
                getUsers: getUsersImpl
            };
        }
    ]);