(function() {
  'use strict';

  angular
    .module('users')
    .controller('ProfileController', ProfileController);

  /* @ngInject */
  function ProfileController($scope, $stateParams, $state, $location, $modal, Languages, Users, Contact, Authentication, $timeout, messageCenterService, profile, contact, appSettings) {

    // No user defined at URL, just redirect to user's own profile
    if(!$stateParams.username) {
      $state.go('profile', {username: Authentication.user.username});
    }

    // ViewModel
    var vm = this;
    vm.profile = profile;
    vm.contact = contact;

    // Exposed to the view
    vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.socialAccountLink = socialAccountLink;
    vm.tabSelected = tabSelected;
    vm.toggleAvatarModal = toggleAvatarModal;
    vm.isWarmshowersId = isWarmshowersId;
    vm.tabs = [
      {
        path: 'about',
        title: 'About',
        content: '/modules/users/views/profile/view-profile-about.client.view.html?c=' + appSettings.commit
      },
      {
        path: 'overview',
        title: 'Overview',
        content: '/modules/users/views/profile/view-profile-sidebar.client.view.html?c=' + appSettings.commit,
        onlySmallScreen: true
      },
      {
        path: 'accommodation',
        title: 'Accommodation',
        content: '/modules/offers/views/offers-view.client.view.html?c=' + appSettings.commit,
        onlySmallScreen: true
      },
      {
        path: 'contacts',
        title: 'Contacts',
        content: '/modules/contacts/views/list-contacts.client.view.html?c=' + appSettings.commit
      }
    ];

    // We landed here from profile editor, show success message
    if($stateParams.updated && profile.username === Authentication.user.username) {
      // $timeout due Angular overwriting message at $state change otherwise
      $timeout(function(){
        messageCenterService.add('success', 'Profile updated');
      });
    }

    /**
     * When contact removal modal signals that the contact was removed, remove it from this scope as well
     * @todo: any better way to keep vm.contact $resolved but wipe out the actual content?
     */
    $scope.$on('contactRemoved', function() {
      delete vm.contact._id;
    });

    /**
     * Determine if given user handle for Warmshowers is an id or username
     * @link https://github.com/Trustroots/trustroots/issues/308
     */
    function isWarmshowersId() {
      var x;
      return isNaN(vm.profile.extSitesWS) ? !1 : (x = parseFloat(vm.profile.extSitesWS), (0 | x) === x);
    }

    /**
     * Open avatar modal (bigger photo)
     */
    function toggleAvatarModal() {
      $modal.open({
        template: '<a tr-avatar data-user="avatarModal.profile" data-size="512" data-link="false" ng-click="avatarModal.close()"></a>',
        controller: function($scope, $modalInstance, profile) {
          var vm = this;
          vm.profile = profile;
          vm.close = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'avatarModal',
        animation: true,
        windowClass: 'modal-avatar',
        resolve: {
          profile: function() {
            return vm.profile;
          }
        }
      });
    }

    /**
     * Determine which tab to select
     */
    function tabSelected() {
      return ($stateParams.tab && ['overview', 'contacts'].indexOf($stateParams.tab) > -1) ? $stateParams.tab : 'overview';
    }

    /**
     * Check if there are additional accounts
     */
    function hasConnectedAdditionalSocialAccounts(provider) {
      for (var i in vm.profile.additionalProvidersData) {
        return true;
      }
      return false;
    }

    /**
     * Check if provider is already in use with profile
     */
    function isConnectedSocialAccount(provider) {
      return vm.profile.provider === provider || (vm.profile.additionalProvidersData && vm.profile.additionalProvidersData[provider]);
    }

    /**
     * Return an URL for user's social media profiles
     * Ensure these fields are set at users.profile.server.controller.js
     */
    function socialAccountLink(providerName, providerData) {
      if(providerName === 'facebook' && providerData.id) {
        return 'https://www.facebook.com/app_scoped_user_id/' + providerData.id;
      }
      else if(providerName === 'twitter' && providerData.screen_name) {
        return 'https://twitter.com/' + providerData.screen_name;
      }
      else if(providerName === 'github' && providerData.login) {
        return 'https://github.com/' + providerData.login;
      }
      else return '#';
    }

  }

})();
