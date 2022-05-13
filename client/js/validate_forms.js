$(document).ready(function () {

  // Set validation restrictions for the add media form
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
});


