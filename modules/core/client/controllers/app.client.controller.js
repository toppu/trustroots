(function(){
  'use strict';

  /**
   * Application wide view controller
   */
  angular
    .module('core')
    .controller('AppController', AppController);

  /* @ngInject */
  function AppController($scope, $rootScope, $window, $state, Authentication, SettingsFactory, Languages, localStorageService) {

    // ViewModel
    var vm = this;

    // Exposed to the view
    vm.user = Authentication.user;
    vm.appSettings = SettingsFactory.get();
    vm.languageNames = Languages.get('object');
    vm.goHome = goHome;
    vm.signout = signout;
    vm.photoCredits = [];

    // Used as a cache buster with ng-include
    // Includes a hash of latest git commit
    vm.cacheBust = vm.appSettings.commit || '';

    /**
     * Determine where to direct user from "home" links
     */
    function goHome() {
      if(Authentication.user) {
        $state.go('search');
      }
      else {
        $state.go('home');
      }
    }

    function signout($event) {
      if($event) {
        $event.preventDefault();
      }

      // Clear out localstorage
      // @link https://github.com/grevory/angular-local-storage#clearall
      localStorageService.clearAll();

      // Do the signout and refresh the page
      $window.top.location.href  = '/api/auth/signout';
    }

    /**
     * Snif and apply user changes
     */
    $scope.$on('userUpdated', function(){
      vm.user = Authentication.user;
    });

    /**
     * Before page change
     */
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      // Redirect away from frontpage if user is authenticated
      if(toState.name === 'home' && Authentication.user) {
        event.preventDefault();
        $state.go('search');
      }

      // Redirect to login page if no user
      if(toState.requiresAuth && !Authentication.user) {
        // Cancel stateChange
        event.preventDefault();

        // Save previous state
        // See modules/users/client/controllers/authentication.client.controller.js for how they're used
        $rootScope.signinState = toState.name;
        $rootScope.signinStateParams = toParams;

        // Show action based signup banner for certain pages
        if(toState.name === 'profile') {
          $state.go('profile-signin');
        }
        else if(toState.name === 'search') {
          $state.go('search-signin', toParams || {});
        }
        // Or just continue to the signup page
        else {
          $state.go('signin', {'continue': true});
        }
      }

    });

    /**
     * After page change
     */
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      // Reset photo copyrights on each page change
      // trBoards directive hits in after this and we'll fill this with potential photo credits
      vm.photoCredits = [];

      // Reset page scroll on page change
      $window.scrollTo(0,0);

      // Analytics
      if (typeof(ga) === 'function') {
        ga('send', 'pageview', {
          'page': toState.url,
          //'title': ''
        });
      }

    });

    /**
     * Sniff and apply photo credit changes
     */
    $scope.$on('photoCreditsUpdated', function(scope, photo) {
      vm.photoCredits.push(photo);
    });

  }

})();
