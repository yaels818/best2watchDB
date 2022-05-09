$(document).ready(function () {
  
  // Hide fields while series checkbox is off
  $("#seasons-group").hide();
  $("#episodes-group").hide();

  // Show fields when series checkbox is on
  $("#is_series_field").change(function () {
  $("#seasons-group").toggle();
  $("#episodes-group").toggle();
  });

  // Set validation restrictions for the form
    $("form[id='media_form']").validate({
        
      // Specify validation rules
        rules: {
          "id_field":{
            required: true,
            minlength: 1
          },
          "name_field": {
            required: true,
            text: true,
            minlength: 1
          },
          "pic_url_field":{
            required: true,
            text: true,
            minlength: 1
          }
          
        },
        // Specify validation error messages
        messages: {       
          name: "Your name must be at least 5 characters long",
          id_field:{
            digits:"Please enter only digits",
            minlength: "Your name must be at least 6 characters long"
          },
          email: "email structure is some@domain "
        }
      });

    // process the form
    $('#user_form').submit(function (event) {
        if(!$("#user_form").valid()) return;

        console.log("in submit");
        
        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: '/users', // the url where we want to POST
            contentType: 'application/json',
            data: JSON.stringify({
                "name": $("#username").val(),
                "password": $("#password").val(),
                "profession": $("#profession").val(),
                "id": $("#id_field").val(),
                "email": $("#email").val(),
            }),
            processData: false,            
           // dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            success: function( data, textStatus, jQxhr ){
                console.log(data);
                location.href = "/main";

            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        })
          
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

});

