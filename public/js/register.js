$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            emailAddress = $form.find("input[name='emailAddress']").val(),
            password = $form.find("input[name='password']").val(),
            pwHash = hex_md5($form.find("input[name='password']").val()),
            confirm = $form.find("input[name='confirm']").val(),
            displayName = $form.find("input[name='displayName']").val(),
            url = $form.attr("action"),
            posting;
        if (password !== confirm) {
            console.log('got here');
            $("#error").text("Your passwords don't match");
            return false;
        }
        posting = $.post(url, {emailAddress: emailAddress, password: pwHash, displayName: displayName});
        posting.done(function (data) {
            console.log(data);
            if (data.result === "ok") {
                window.location.assign("/");
            };
        });    
        posting.fail(function (data) {
            console.log(data);
            $("#error").text(data.responseJSON.reason);
        });
    });
});