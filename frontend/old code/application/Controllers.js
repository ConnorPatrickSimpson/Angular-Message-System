var notifyInstantiated = function(text){
	console.log(text.concat(" has been instantiated."));
};

var MESSAGE_POLLING_INTERVAL = 1000;
var CONVERSATION_UPDATE_POLLING_INTERVAL = 1000;

angular.module('client.controllers')
	.controller('masterConversationController', ['$scope','$interval', '$routeParams','conversationRepository','conversationsSingletonService',
	    function ($scope, $interval,$routeParams, conversationRepository,conversationsSingletonService) {
	    	// This controller can basically be thought of as the initializing controller. No heavy lifting is done here.
	    	// At best we select the current conversation, we select the current user from $routeParams
			notifyInstantiated("masterConversationController");
			// $scope.selectedUser = $routeParams.userName;
			conversationsSingletonService.setUser($routeParams.userName );


			console.log($routeParams.userName.concat(" is our selected User"));
			// The next thing we do is grab a list of conversation Id's

				conversationRepository.getConversationAll($scope.selectedUser).then(
                // Code for Successful Request
                function (response) {
                	// console.log("Success!");
                    $scope.conversations = response.data;
                    var conversationMetaData = []

                    for(j = 0; j< $scope.conversations.length; j++)
                    {
                    	var obj = {
                    		Title: $scope.conversations[j].title,
                    		Id: $scope.conversations[j].id
                    	};
                    	conversationMetaData.push(obj);
                    	// console.log(obj);
                    }
                    console.log(conversationMetaData);

                    conversationsSingletonService.setConvo(conversationMetaData[0].id);
	                conversationsSingletonService.setConvos(conversationMetaData);

	                $scope.conversationSelected = $scope.conversations[0].id;

                });
	    }
		]);


//There exists a menu section at the top of our ConversationsPartialView.
//This section lists all conversations relevant to a user. This controller exists to deal with
//user and backend interactions that have ANYTHING to do with that menu bar.
//Right now the two primary functions this provides are
//		1) We check to see if there are updates to conversations that are not currently open.
//		2) Upon clicking a conversation in the list, the application switches focus from one conversation to another.
angular.module('client.controllers')
	.controller('conversationsMenuBarController',['$scope','$interval','conversationsSingletonService',
		function($scope,$interval, conversationsSingletonService)
		{
			notifyInstantiated("conversationsMenuBarController");
			 var user = conversationsSingletonService.getUser();
			$scope.conversations = [];
			$scope.user = "";

			// This is a click callback function that changes our target conversation.
			$scope.changeConversation = function(conversationID)
			{
				console.log(conversationID);
				conversationsSingletonService.setConvo(conversationID);
			}
/*
TODO: Create a list of users.
 			Append to Conversations frontendDataModel...
			The currentConversationController will create a new conversation for unregistered conversations.
			This is how we avoid creating n choose two conversations in the backend.
*/

			// This is function that is called at regular intervals. It is intended to keep up up to date with
			// What conversations exist and which of the unopened conversations have been updated.
			 var pollAndUpdateMenuConversations = function()
			 {
				 //This is where we check to see if conversations have new messages.
				 //TODO: Poll for new messages.
			 	 $scope.conversations = conversationsSingletonService.getConvos();
			 	 $scope.user = conversationsSingletonService.getUser();
			 };
			 // Start repeat at some interval
			 var repeat = $interval(function(){pollAndUpdateMenuConversations();} , CONVERSATION_UPDATE_POLLING_INTERVAL);

		}]);


// There exists a section of our code that deals with monitoring ONE conversation at a time. This section
// is responsible for polling the backend for new messages AND sending new messages.
// The following controller deals with that section.
angular.module('client.controllers')
	.controller('currentConversationController',['$scope','$interval', 'messageRepository','conversationsSingletonService',
		function ($scope, $interval, messageRepository,conversationsSingletonService) {
			// For the selected conversation and selected user. Keep polling our backend for new messages.
			notifyInstantiated("currentConversationController");
 			// The following function is a "Send" button callback. This is how we send messages to our backend.
 			$scope.newMessage = function (messageContent) {
				var selectedUser = conversationsSingletonService.getUser();
				var selectedConversation = conversationsSingletonService.getConvo();
	            var msg = {
	                message: messageContent,
	                sender: {
	                    userName : selectedUser
	                },
	                associatedConversation: {
	                    Id: selectedConversation
	                },
                    createdOn: new Date().toISOString()
	            };
	            messageRepository.createMessage(msg, selectedConversation).then(
                    // Code for Successful Request
                    function (response) {
                        msg.messageId = response.data;
						$scope.messages.push(msg);
                    },
                    // Code for Failed Request
                    function (response) {
                        return;
                    }
                );
	        };

	        // The following is our polling setup. This function is called at a regular interval and deals
	        // with getting information from our backend appended to our front end Data-model.
			var pollAndUpdateSelectedConversationDataModel = function()
			{
				var selectedConversation = conversationsSingletonService.getConvo();
				var selectedUser = conversationsSingletonService.getUser();

				if (typeof null != selectedConversation)
				{
					messageRepository.getMessagesAll(selectedConversation).then(function(response){
						var messages = response.data;
						var messagesToDisplay = [];
						//This is appending information to our datamodel so that we know what
						//Messages belong on the right side.
		                for (i = 0; i < messages.length; i++)
		                {
		                	var b = messages[i];
		                	if(b.sender.userName == selectedUser)
		                	{
		                		b.isOriginator = 'true';
		                	}
		                	messagesToDisplay.push(b);
		                }
		                // Further Pruning of messages happens here

		               	// TODO: Change the front end model to supprt message conatenation.
		               	// 		 That is... Instead of having text appear in many chat bobbles.
		               	//		 Maybe serveral messages to a chat bubble delimited of course by time,
		               	//		 and the author.

		                console.log(messagesToDisplay);
		                $scope.messages = messagesToDisplay;


					},function(error){
										console.log(error);
					});
				}

			}
			var repeat = $interval(function(){pollAndUpdateSelectedConversationDataModel();} , MESSAGE_POLLING_INTERVAL);
}]);

angular.module('client.controllers')
	.controller('loginController',['$scope',function($scope)
		{
			console.log("The loginController has been instantiated");
		}]);



angular.module('client.controllers')
    .controller('conversationController', ['$scope','$interval','$routeParams', 'conversationRepository', 'messageRepository',
	    function ($scope, $interval,$routeParams, conversationRepository, messageRepository) {
			// Send the last pae of the conversation.
			// Background Sync process.
	        $scope.selectedUser = $routeParams.userName;

	        var pollAndUpdateFrontEndDataModels = function()
	        {
	        	 // Fetch all available conversations and add to $scope.conversations
				conversationRepository.getConversationAll($scope.selectedUser).then(
                // Code for Successful Request
                function (response) {
                	// console.log("Success!");
                    $scope.conversations = response.data;
	                $scope.conversationSelected = $scope.conversations[0].Id;
	                var a = $scope.conversations[0];
	                var newMessages = [];
	                // console.log(a);
	                for (i = 0; i < a.Messages.length; i++)
	                {
	                	var b = a.Messages[i];
	                	if(b.sender.userName == $scope.selectedUser)
	                	{
	                		b.isOriginator = 'true';
	                	}
	                	newMessages.push(b);
	                }
					$scope.conversations[0].Messages = newMessages;
					// console.log($scope.conversations[0]);
                },
                // Code for Failed Request
                function (response) {
                    console.log("The world has ended");
                    return;
                }
            );
	        };

	        //TODO: rework pollAndUpdateFrontEndDataModels() in ways that
	        //improve overall efficiency. THIS IS OUR PERFORMANCE BOTTLENECK!!!
			//This function calls the pollAndUpdateFrontEndDataModels function
			var repeat = $interval(function(){ pollAndUpdateFrontEndDataModels();} , 1000);



	        // Method for submitting new messages and assigning ID to these messages
            // Can be called from an ng event but must pass a string literal as parameter
	        $scope.newMessage = function (messageContent) {
	            userId = $scope.selectedUser;
	            var conversationID = $scope.conversationSelected;
	            var msg = {
	                message: messageContent,
	                sender: {
	                    userName : userId
	                },
	                associatedConversation: {
	                    Id: conversationID
	                },
                    createdOn: new Date().toISOString()
	            };

	            messageRepository.createMessage(msg, conversationID).then(
                    // Code for Successful Request
                    function (response) {
                        msg.messageId = response.data;
						$scope.conversations[0].Messages.push(msg);
                    },
                    // Code for Failed Request
                    function (response) {
                        return;
                    }
                );
	        };
	    }
    ]);

function concatMessages(arrayOfMessages) {
    // Pass this function an Array of messages. This function will go through the messages and look for consequitive
    // messages from the same user,
    // Consecutive mesxages from the same user will be shrunk down to a single speech bubble.
    // In practice that data on the backend will always be segmented by submission and not be concatenated. This function serves to shrink
    // the number of messages in the FRONT END MODEL ONLY.
    console.log("Concating ArrayOfMessages");
    console.log(arrayOfMessages);


    var newArray = [];
    currentMessage = arrayOfMessages[0];

    for (i = 1; i < arrayOfMessages.length; i++) {
        if (currentMessage.sender.userName == arrayOfMessages[i].sender.userName) {
            currentMessage.message.concat("\n".concat(arrayOfMessages[i].message));
        }
        if (i == arrayOfMessages.length - 1) {
            newArray.push(currentMessage);
        }
        else {
            newArray.push(currentMessage);
            currentMessage = arrayOfMessages[i];
        }
    }
    console.log("Ok So here is what your concatted message list is going to look like");
    console.log(newArray);
    console.log("====================================================================");


    return newArray;
}
