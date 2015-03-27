$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            emailAddress = $form.find("input[name='emailAddress']").val(),
            url = $form.attr("action"),
            posting;
        posting = $.post(url, {emailAddress: emailAddress});
        posting.done(function (data) {
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