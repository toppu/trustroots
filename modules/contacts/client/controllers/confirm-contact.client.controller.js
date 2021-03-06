(function() {
  'use strict';

  angular
    .module('contacts')
    .controller('ContactConfirmController', ContactConfirmController);

  /* @ngInject */
  function ContactConfirmController($state, $stateParams, Authentication, Contact, contact) {

    // ViewModel
    var vm = this;

    // If no friend ID defined, go to elsewhere
    if (!$stateParams.contactId) {
      vm.error = 'Something went wrong. Try again.';
    }

    vm.isConnected = false;
    vm.isLoading = true;
    vm.contact = contact;
    vm.confirmContact = confirmContact;

    // First fetch contact object, just to make it sure it exists
    vm.contact.$promise.then(
      // Got contact
      function(contact) {
        vm.isLoading = false;
        if(vm.contact.confirmed === true) {
          vm.isConnected = true;
          vm.success = 'You two are already connected. Great!';
        }
        // [0] contains contact requester's id, [1] is the receiver
        else if (vm.contact.users[0]._id !== Authentication.user._id) {
          vm.error = 'You must wait until he/she confirms your connection.';
        }
      },
      // Error getting contact
      function(errorResponse) {
        vm.isWrongCode = true;
        vm.error = errorResponse.status === 404 ? 'Could not find contact request. Check the confirmation link from email or you might be logged in with wrong user?' : 'Something went wrong. Try again.';
      }
    );

    function confirmContact() {
      vm.isLoading = true;
      vm.contact.confirm = true;
      vm.contact.$update(function(response) {
        vm.isLoading = false;
        vm.isConnected = true;
        vm.success = 'You two are now connected!';
      }, function(errorResponse) {
        vm.isLoading = false;
        vm.error = errorResponse.data.message;
      });
    }

  }

})();
