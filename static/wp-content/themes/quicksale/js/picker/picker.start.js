jQuery(document).ready(function () {
(function($) {
/*jshint
 debug: true,
 devel: true,
 browser: true,
 asi: true,
 unused: false
 */



/*
 * Initialize all the others
 */

$( '.js__datepicker' ).pickadate({

    // Work-around for some mobile browsers clipping off the picker.
    onOpen: function() { $('pre').css('overflow', 'hidden') },
    onClose: function() { $('pre').css('overflow', '') },
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec' ],
    showMonthsShort: true,
    format: 'mm.dd.yyyy',
    formatSubmit: 'yyyy/mm/dd',
    min: true
})
$( '.js__timepicker' ).pickatime()


})(jQuery);
});