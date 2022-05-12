let mediaData;
let curr_update_media_id;

$(document).ready(function () {

    $("#addMedia_btn_1").click(openAddMedia);
    $("#addMedia_btn_2").click(openAddMedia);
    $("#close_btn").click(closeAddMedia);
    $("#update_close_btn").click(closeUpdateMedia);


    closeAddMedia();
    closeUpdateMedia();
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

        $('#update_media_form').submit(function (event) {
            submitUpdateMedia();
            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
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
                        '<td>'+ "<button id = \"" + object["id?"] + "_updateMedia" + "\" onclick = openUpdateMedia(\""+object["id?"]+"\") > update </button>" +
                        "<br>" + "<button id = \"" + object["id?"] + "_addActor" + "\" onclick = addActor(\""+object["id?"]+"\") > add actor </button>" +
                        "<br>" + "<button id = \"" + object["id?"] + "_viewActors" + "\" onclick = viewActors(\""+object["id?"]+"\") > view actors </button>" +
                        "<br>" + "<button id = \"" + object["id?"] + "\" onclick = removeMedia(\""+object["id?"]+"\") > remove media </button>" + "</td>";

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

function openUpdateMedia(media_id){

    curr_update_media_id = media_id;
    let element = document.getElementById("div_update_media_form")
    element.style.display = "block";

    let media = mediaData.find(x => x[Object.keys(x)[0]] === media_id);

    $("#update_name_field").val(media.name);
    $("#update_pic_url_field").val(media.picture);
    $("#update_director_field").val(media.director);
    $("#update_date_field").val(media.date);
    $("#update_rating_field").val(media.rating);
    $("#update_is_series_field").val(media.isSeries);
    $("#update_episodes_field").val(media.series_details);
}

function closeUpdateMedia(){

    let element = document.getElementById("div_update_media_form")
    element.style.display = "none";
}

function submitUpdateMedia(){
    //if(!$("#user_form").valid()) return;

    // process the form
    $.ajax({
        type: 'PUT', 
        url: '/movie/'+curr_update_media_id, 
        contentType: 'application/json',
        data: JSON.stringify({
            "movie_id": curr_update_media_id,
            "movieDetails":{
            "movieId": curr_update_media_id,
            "name": $("#update_name_field").val(),
            "picture": $("#update_pic_url_field").val(),
            "director": $("#update_director_field").val(),
            "date": $("#update_date_field").val(),
            "rating": $("#update_rating_field").val(),
            "isSeries": $("#update_is_series_field").val(),
            "series_details" : "["+$("#update_episodes_field").val()+"]",
            }}),
        processData: false,            
        encode: true,
        success: function( data, textStatus, jQxhr ){
            //console.log(data);
            alert("media update!");
            fillTable();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("media not update!");
        }
    })

    closeUpdateMedia();
}

function addActor(media_id)
{
    
}

function viewActors(media_id)
{
    
}

function removeMedia(media_id)
{
    let media = mediaData.find(x => x[Object.keys(x)[0]] === media_id);

    if (confirm('Are you sure you want to delete '+ media.name +'?')) {
        $.ajax({
            type: 'DELETE', // define the type of HTTP verb we want to use (POST for our form)
              url: '/movie/'+media_id, // the url where we want to POST
              contentType: 'application/json',
            success: function (result) {
                alert("media deleted");
                fillTable();
            },
            error: function (err) {
              console.log("err", err);
            }
          });
      } 
      else {}

    
}


