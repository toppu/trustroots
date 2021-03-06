(function() {
  'use strict';

  angular
    .module('pages')
    .controller('FaqController', FaqController);

  /* @ngInject */
  function FaqController($timeout, $window) {

    var $body = angular.element('body');

    // ViewModel
    var vm = this;

    // Exposed to the view
    vm.read = read;

    // Toggles for the accordion
    vm.sidebar = {
      // Toggles for each invidual panel
      isCommunityOpen: true,
      isOrganisationOpen: true,
      isTechnologyOpen: true,
      // Close other panels if one is open?
      closeOthers: false
    };

    /*
     * Init
     * @todo move to a directive
     */
    (function() {
      // Determine if sidebar should be scrolling or not
      $timeout(function(){
        if($window.innerHeight <= angular.element('#faq-sidebar').height()) {
          vm.sidebar.isCommunityOpen = false;
          vm.sidebar.isOrganisationOpen = false;
          vm.sidebar.isTechnologyOpen = false;
          vm.sidebar.closeOthers = true;
        }
      });
      // Determine fixed width for the sidebar so it doesn't overflow when it gets fixed position
      angular.element('#faq-sidebar').css({ 'max-width': angular.element('#faq-sidebar').width() });
    })();

    /**
     * Scroll+highlight a FAQ question when clicking title at sidebar
     * @todo move to a directive
     */
    function read(id) {
      var $el = angular.element('#' + id);

      // Scroll to element
      $body.animate({scrollTop: $el.offset().top - 60}, 'fast');

      // Performs color flash for link, see faq.less for more.
      // Animation time at CSS is 1000ms
      $el.addClass('faq-question-flash');
      $timeout(function(){
        $el.removeClass('faq-question-flash');
      }, 1010);
    }

  }
})();
