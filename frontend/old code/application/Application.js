
// Azure Service Bus:


// Load Client.Controllers and Client.Repositories modules prior to loading Client module
angular.module('client.controllers', []);
angular.module('client.repositories', []);

// Inject Client.Controllers and Client.Repositories modules into Client module
angular.module('client', ['ngRoute',
                                  'client.controllers',
                                  'client.repositories'])
        // Configuring Controllers
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/login',{
                    controller: 'loginController',
                    templateUrl: 'Partials/LoginPartialView.html'
                })
                .when('/conversations/:userName', {
                    // controller: 'conversationController',
                    controller: 'masterConversationController',
                    templateUrl: 'Partials/ConversationsPartialView.html'
                })
                .otherwise({
                           redirectTo: '/login' 
                });
        }]);


// OK so here is the flow as I've imagined it. 
// User is greeted with a login page. Upon logging in. A stringLiteral is passed via $RouteParams to the conversations route.
// The conversations route has an associated conversationsController(plural). That controller fetches all available
// conversations and populates a navigation bar with possible conversations. It also automatically routes /conversation
// with parameters that are associated with the first availabe conversation. The conversation(singular) route spins up a
// conversationControler(singular). This controller spins up a polling process for a single conversation(conversation)
// that is selected.  


// Proposed polling algororithm.  
/// Polling requires a requerst made with a conversation and message Guuid. Check last element of our messageslist
// if the GUUID's match then pass back success message. If the GUUIDS are not the same then send back a message 
// that indicates that there is a pending message. If that is the case update a front end data model that determines
// which of the conversations have not been responded to yet.  