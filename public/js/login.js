$(document).ready(function () {
    $('form').submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            emailAddress = $form.find('input[name="emailAddress"]').val(),
            pwHash = hex_md5($form.find("input[name='password']").val()),
            url = $form.attr('action'),
            posting = $.post(url, {emailAddress: emailAddress, password: pwHash});

        posting.done(function (data) {
            if (data.result === 'ok') {
                window.location.assign('/');
            } else if (data.result === 'error') {
                $('#error').text(data.reason);
            }
            console.log(data.status);
        });
    });
});
