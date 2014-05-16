$(document).ready(function () {
    $('form').submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            emailAddress = $form.find('input[name="emailAddress"]').val(),
            pwHash = hex_md5($form.find("input[name='password']").val()),
            url = $form.attr('action'),
            posting = $.post(url, {username: username, password: pwHash});

        posting.done(function (data) {
            if (data.status === 'success') {
                window.location.assign('/Pin');
            } else if (data.status === 'error') {
                $('#error').text(data.reason);
            }
            console.log(data.status);
        });
    });
});
