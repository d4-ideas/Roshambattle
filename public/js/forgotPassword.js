$(document).ready(function () {
    $("form[name='forgot']").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            emailAddress = $form.find("input[name='emailAddress']").val(),
            url = $form.attr("action"),
            posting;
        posting = $.post(url, {emailAddress: emailAddress});
        posting.done(function (data) {
            if (data.result === "ok") {
                alert('Check your spam for our password reset message.');
                window.location.assign("/");
            };
        });    
        posting.fail(function (data) {
            console.log(data);
            $("#error").text(data.responseJSON.reason);
        });
    });
});
$(document).ready(function () {
    $("form[name='remember']").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            emailAddress = $form.find("input[name='emailAddress']").val(),
            pwHash = hex_md5($form.find("input[name='password']").val()),
            tokenKey = $form.find("input[name='tokenKey']").val(),
            url = $form.attr("action"),
            posting;
        console.log($form);
        posting = $.post(url, {email: emailAddress, password: pwHash, tokenKey: tokenKey});
        posting.done(function (data) {
            if (data.result === "ok") {
                alert('Your password has been reset. Try to hang on to it this time.');
                window.location.assign("/");
            };
        });    
        posting.fail(function (data) {
            console.log(data);
            $("#error").text(data.responseJSON.reason);
        });
    });
});