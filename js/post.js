//var name = document.getElementById('name');
//var submit = document.getElementById('submit');

//submit.addEventListener("submit", post);

var formData = JSON.stringify($("#login").serializeArray());

$.ajax({
    type: "POST",
    url: "serverUrl",
    data: formData,
    success: function () { alert("Fff");},
    dataType: "json",
    contentType: "application/json"
});