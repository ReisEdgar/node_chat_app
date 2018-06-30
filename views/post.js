//var name = document.getElementById('name');
//var submit = document.getElementById('submit');

//submit.addEventListener("submit", post);

var formData = JSON.stringify($("#login").serializeArray());

$.ajax({
    type: "POST",
    url: "serverUrl",
    data: formData,
    success: function () { },
    dataType: "json",
    contentType: "application/json"
});