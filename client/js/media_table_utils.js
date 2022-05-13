let mediaData;
let curr_update_media_id;

$(document).ready(function () {

    // Establish button functions
    $("#addMedia_btn_1").click(openAddMedia);
    $("#addMedia_btn_2").click(openAddMedia);
    $("#close_btn").click(closeAddMedia);
    $("#update_close_btn").click(closeUpdateMedia);
    $("#actor_close_btn").click(closeAddActor);
    $("#view_actor_close_btn").click(closeViewActor);

    // Fill media table
    fillTable();
  
    // 
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

    $('#actor_form').submit(function (event) {
        submitAddActor();
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

// Fill media table
function fillTable()
{
    GetList();

    const jsonObj = mediaData;
    
    var table = document.getElementById("listMediaTB");

    table.innerHTML = "<thead><tr><th>Media-ID</th><th>Name</th><th>Picture</th><th>Rating</th><th>Release Date</th><th>Action</th></tr></thead>";

    jsonObj.forEach(function(object) {

        var tr = document.createElement('tr');
        tr.innerHTML =  '<td>' + object["id?"] + '</td>' +
                        '<td>' + object["name"] + '</td>' +
                        '<td>' + '<img src = "' + object["picture"] + '"/img>' + '</td>' +
                        '<td>' + object["rating"] + '</td>' +
                        '<td>' + object["date"] + '</td>'+
                        '<td>'+ "<button class = \"action_btn\" id = \"" + object["id?"] + "_updateMedia" + "\" onclick = openUpdateMedia(\""+object["id?"]+"\") > Update </button>" +
                        "<br>" + "<button class = \"action_btn\" id = \"" + object["id?"] + "_addActor" + "\" onclick = openAddActor(\""+object["id?"]+"\") > Add Actor </button>" +
                        "<br>" + "<button class = \"action_btn\" id = \"" + object["id?"] + "_viewActors" + "\" onclick = openViewActors(\""+object["id?"]+"\") > View Actors </button>" +
                        "<br>" + "<button class = \"action_btn\" id = \"" + object["id?"] + "\" onclick = removeMedia(\""+object["id?"]+"\") > Remove Media </button>" + "</td>";

        table.appendChild(tr);
    });
}

// Open add media pop-up window
function openAddMedia(){

    // Display side window
    let element = document.getElementById("div_media_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);

    $("button.btn_add").click(function(){
        $("button.action_btn").attr("disabled", false);
    });
    $("button.btn_close").click(function(){
        $("button.action_btn").attr("disabled", false);
    });

    $("#seasons-group").hide();
    $("#episodes-group").hide();

    // Show these fields only when series checkbox is on
    $("#is_series_field").click(function () {
        if ($(this).is(":checked")) {
        $("#seasons-group").show();
        $("#episodes-group").show();
        } else {
        $("#seasons-group").hide();
        $("#episodes-group").hide();
    }
});
}

// Close add media pop-up window
function closeAddMedia(){

    let element = document.getElementById("div_media_form")
    element.style.display = "none";
}

// Submit add media form, close pop-up window and refresh table
function submitAddMedia(){
    
    // Convert needed fields to match json format
    var is_series = false;
    let series_details = [];

    if ($('#is_series_field').is(":checked"))
    {
        is_series = true;
        series_details = $("#episodes_field").val().split(",");

        for (let i = 0; i < series_details.length; i++) {
            series_details[i] = Number(series_details[i]);
        } 
    }

    console.log(series_details);

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
            "date": $("#date_field").val().split("-").reverse().join("-"),
            "rating": Number($("#rating_field").val()),
            "isSeries": is_series,
            "series_details" : series_details,
        }),
        processData: false,            
        encode: true,
        success: function( data, textStatus, jQxhr ){
            console.log(data);
            alert("media added!");
            closeAddMedia();
            fillTable();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("media not added!");
        }
    })
}

// Open update media pop-up window filled with data from json file
function openUpdateMedia(media_id){

    curr_update_media_id = media_id;
    let element = document.getElementById("div_update_media_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);

    $("button.btn_add").click(function(){
        $("button.action_btn").attr("disabled", false);
    });
    $("button.btn_close").click(function(){
        $("button.action_btn").attr("disabled", false);
    });

    $("#update_seasons-group").hide();
    $("#update_episodes-group").hide();

    // Show these fields only when series checkbox is on
    $("#update_is_series_field").click(function () {
        if ($(this).is(":checked")) {
        $("#update_seasons-group").show();
        $("#update_episodes-group").show();
        } else {
        $("#update_seasons-group").hide();
        $("#update_episodes-group").hide();
    }
    });

    let media = mediaData.find(x => x[Object.keys(x)[0]] === media_id);

    // Convert needed fields from json format
    
    var date = media.date.split("-").reverse().join("-");
    var seasons = 0;

    if (media.isSeries == true){
        $("#update_is_series_field").attr('checked', true);
        seasons = media.series_details.length;
    }
    else{
        $("#update_is_series_field").attr('checked', false);
    }

    console.log(date);
    console.log(seasons);

    $("#update_name_field").val(media.name);
    $("#update_pic_url_field").val(media.picture);
    $("#update_director_field").val(media.director);
    $("#update_date_field").val(date);
    $("#update_rating_field").val(media.rating);
    $("#update_seasons_field").val(seasons)
    $("#update_episodes_field").val(media.series_details);
}

// Close update media pop-up window
function closeUpdateMedia(){

    let element = document.getElementById("div_update_media_form")
    element.style.display = "none";
}

// Submit update media form, close pop-up window and refresh table
function submitUpdateMedia(){

    // Convert needed fields to match json format
    var is_series = false;
    let series_details = [];

    if ($('#update_is_series_field').is(":checked"))
    {
        is_series = true;
        series_details = $("#episodes_field").val().split(",");

        for (let i = 0; i < series_details.length; i++) {
            series_details[i] = Number(series_details[i]);
        } 
    }
    
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
            "date": $("#update_date_field").val().split("-").reverse().join("-"),
            "rating": Number($("#update_rating_field").val()),
            "isSeries": is_series,
            "series_details" : series_details,
            }}),
        processData: false,            
        encode: true,
        success: function( data, textStatus, jQxhr ){
            //console.log(data);
            alert("media updated!");
            closeUpdateMedia();
            fillTable();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("media not updated!");
        }
    })
}

function openAddActor(media_id){
    curr_update_media_id = media_id;
    let element = document.getElementById("div_actor_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);

    $("button.btn_add").click(function(){
        $("button.action_btn").attr("disabled", false);
    });
    $("button.btn_close").click(function(){
        $("button.action_btn").attr("disabled", false);
    });
}

function closeAddActor(){
    let element = document.getElementById("div_actor_form")
    element.style.display = "none";
}

function submitAddActor()
{
    $.ajax({
        type: 'PUT', 
          url: '/actor/'+curr_update_media_id, 
          contentType: 'application/json',
          data: JSON.stringify({
            "movie_id": curr_update_media_id,
            "actorDetails":{
              "name": $("#actor_name_field").val(),
              "picture": $("#actor_pic_url_field").val(),
              "site" : $("#actor_page_url_field").val(),
              }
          }),
          processData: false,            
          encode: true,
        success: function( data, textStatus, jQxhr ){
            //console.log(data);
            alert("actor updated!");
            closeAddActor();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("actor not updated!");
        }
      });
}

function openViewActors(media_id)
{
    curr_update_media_id= media_id;

    let element = document.getElementById("div_view_actor_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);

    $("button.btn_add").click(function(){
        $("button.action_btn").attr("disabled", false);
    });
    $("button.btn_close").click(function(){
        $("button.action_btn").attr("disabled", false);
    });
    
    var table = document.getElementById("actorsTB");

    table.innerHTML = "<thead><tr> <th>Name</th> <th>Picture</th> <th>Page</th> <th>Action</th> </tr></thead>";

    $.ajax({
        url: "/list/"+media_id,
        success: function (result) {
            let actors = result.actors;

            $.each(actors, function(index, value) {
                var tr = document.createElement('tr');
                tr.innerHTML =  '<td>' + value["name?"] + '</td>' +
                                '<td>' + '<img src = "' + value["picture"] + '"/img>' + '</td>' +
                                '<td>' + '<img src = "' + value["site"] + '"/img>' + '</td>' +
                                '<td>'+ "<button id = \"" + media_id + "_" + value["name?"] + "_removeActor" + "\" onclick = removeActor(\""+value["name?"]+"\") > delete </button></td>";
        
                table.appendChild(tr);
            }); 
        },
        error: function (err) {
          console.log("err", err);
        }
      });
}

function closeViewActor(){
    let element = document.getElementById("div_view_actor_form")
    element.style.display = "none";
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

function removeActor(actor_name)
{
    if (confirm('Are you sure you want to delete '+ actor_name +'?')) {
        $.ajax({
            type: 'DELETE', // define the type of HTTP verb we want to use (POST for our form)
            url: '/actor/'+curr_update_media_id, // the url where we want to POST
            contentType: 'application/json',
            data: JSON.stringify({
                "actorName": actor_name,
            }),
            success: function (result) {
                alert("actor deleted");
                openViewActors(curr_update_media_id);
            },
            error: function (err) {
              console.log("err", err);
            }
          });
      } 
      else {}
}

