$(document).ready(function() {
    $('#theme-widget input[type=radio][name=theme-options]').change(function() {
        if (this.value == 'none') {
            $('body').removeClass('theme-scanlines').removeClass('theme-lcd');
            hideScanlines();
        }
        else if (this.value == 'scanlines') {
            $('body').removeClass('theme-lcd').addClass('theme-scanlines');
            showScanlines();
        }
        else if (this.value == 'lcd') {
            $('body').removeClass('theme-scanlines').addClass('theme-lcd');
            hideScanlines();
        }
    });
});