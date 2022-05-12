let mediaData;

$(document).ready(function () {

    $("#addMedia_btn_1").click(openAddMedia);
    $("#addMedia_btn_2").click(openAddMedia);
    $("#close_btn").click(closeAddMedia);

    closeAddMedia();
    fillTable();
    
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


        $('#media_form').submit(function (event) {
            submitAddMedia();
            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    //$("#add_btn").click(submitAddMedia);


});


function GetList()
{
    $.ajax({
        url: "/GetList",
        async: false,
        success: function (result) {
            mediaData = result;
            console.log(result);
        },
        error: function (err) {
          console.log("err", err);
        }
    });

}

function fillTable()
{
    GetList();
    const jsonObj = mediaData;
    
    var table = document.getElementById("listMediaTB");

    table.innerHTML = "<thead><tr> <th>Media-ID</th><th>Name</th><th>Picture</th><th>Rating</th><th>Release Date</th><th>Action</th></tr></thead>";

    jsonObj.forEach(function(object) {

        var tr = document.createElement('tr');
        tr.innerHTML =  '<td>' + object["id?"] + '</td>' +
                        '<td>' + object["name"] + '</td>' +
                        '<td>' + '<img src = "' + object["picture"] + '"/img>' + '</td>' +
                        '<td>' + object["rating"] + '</td>' +
                        '<td>' + object["date"] + '</td>'+
                        '<td>'+ "<button id = \"" + object["id?"] + "_updateMedia" + "\" onclick = updateMedia("+object["id?"]+") > update </button>" +
                        "<br>" + "<button id = \"" + object["id?"] + "_addActor" + "\" onclick = addActor("+object["id?"]+") > add actor </button>" +
                        "<br>" + "<button id = \"" + object["id?"] + "_viewActors" + "\" onclick = viewActors("+object["id?"]+") > view actors </button>" +
                        "<br>" + "<button id = \"" + object["id?"] + "\" onclick = removeMedia("+object["id?"]+") > remove media </button>" + "</td>";

        table.appendChild(tr);
        //getViewsJSON(object,tr);
    });

    //sortByDate(table);
}

function openAddMedia(){

    let element = document.getElementById("div_media_form")
    element.style.display = "block";
}

function closeAddMedia(){

    let element = document.getElementById("div_media_form")
    element.style.display = "none";
}

function submitAddMedia(){
    //if(!$("#user_form").valid()) return;

    // process the form
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: '/movie', // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "movieId": $("#id_field").val(),
            "name": $("#name_field").val(),
            "picture": $("#pic_url_field").val(),
            "director": $("#director_field").val(),
            "date": $("#date_field").val(),
            "rating": $("#rating_field").val(),
            "isSeries": $("#is_series_field").val(),
            "series_details" : $("#episodes_field").val(),
        }),
        processData: false,            
        encode: true,
        success: function( data, textStatus, jQxhr ){
            //console.log(data);
            alert("media added!");
            fillTable();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("media not added!");
        }
    })

    closeAddMedia();
}

function updateMedia(media_id)
{

}

function addActor(media_id)
{
    
}

function viewActors(media_id)
{
    
}

function removeMedia(media_id)
{
    
}


