let mediaData;
let curr_update_media_id;
let actorsData;

$(document).ready(function () {

    // Establish button functions
    $("#addMedia_btn_1").click(openAddMedia);
    $("#addMedia_btn_2").click(openAddMedia);
    $("#close_btn").click(closeAddMedia);
    
    $("#addActor_btn_1").click(openAddActor);
    $("#addActor_btn_2").click(openAddActor);
    $("#actor_close_btn").click(closeAddActor);

    $("#update_close_btn").click(closeUpdateMedia);
    $("#add_actor_to_media_close_btn").click(closeAddActorToMedia);
    $("#view_actor_close_btn").click(closeViewActor);

    $("#sorts_list option").change(BuildTable);

    // Fill media table
    fillTable("default");
    
  
    // Forms - validate and submit
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

    $('#add_actor_to_media_form').submit(function (event) {
        submitAddActorToMedia();
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });
});

// Call Media Collection
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

// Call Actors Collection
function GetActors()
{
    $.ajax({
        url: "/getActors",
        async: false,
        success: function (result) {
            actorsData = result;
            console.log(result);
        },
        error: function (err) {
          console.log("err", err);
        }
    });

}

// Fill media table
function fillTable(sort_kind)
{
    // Get JSON data into mediaData
    GetList();
    BuildTable(sort_kind);
    
}

function BuildTable(sort_kind){
    let jsonObj;

    // Sort depending on what sort_kind was given 
    switch (sort_kind) {
        case "name_asc":
            jsonObj = sortNameAsc(mediaData);
            break;
        case "name_dec":
            jsonObj = sortNameDec(mediaData);
            break;
        case "rating_asc":
            jsonObj = sortRatingAsc(mediaData);
            break;
        case "rating_dec":
            jsonObj = sortRatingDec(mediaData);
            break;
        case "date_asc":
            jsonObj = sortDateAsc(mediaData);
            break;
        case "date_dec":
            jsonObj = sortDateDec(mediaData);
            break;
        default:
            // Sort by release date - descending
            jsonObj = sortDateDec(mediaData);
    }
    
    var table = document.getElementById("listMediaTB");

    table.innerHTML =   "<thead><tr>" +
                        "<th>Media-ID</th>" + 
                        "<th data-type=\"string\">Name</th>" + 
                        "<th>Picture</th>" + 
                        "<th data-type=\"number\">Rating</th>" +
                        "<th data-type=\"date\">Release Date</th>" +
                        "<th>Action</th>" +
                        "</tr></thead>";

    jsonObj.forEach(function(object) {

        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        tr.innerHTML =  '<td>' + object["movieId"] + '</td>' +
                        '<td>' + object["name"] + '</td>' +
                        '<td>' + '<img src = "' + object["picture"] + '"/img>' + '</td>' +
                        '<td>' + object["rating"] + '</td>' +
                        '<td>' + object["date"] + '</td>'+
                        '<td>' + "<button class = \"action_btn\" id = \"" + object["movieId"] + "_updateMedia" + "\" onclick = openUpdateMedia(\""+object["movieId"]+"\") > Update </button>" +
                        "<br>" + "<button class = \"action_btn\" id = \"" + object["movieId"] + "_addActorToMedia" + "\" onclick = openAddActorToMedia(\""+object["movieId"]+"\") > Add Actor </button>" +
                        "<br>" + "<button class = \"action_btn\" id = \"" + object["movieId"] + "_viewActors" + "\" onclick = openViewActors(\""+object["movieId"]+"\") > View Actors </button>" +
                        "<br>" + "<button class = \"action_btn\" id = \"" + object["movieId"] + "\" onclick = removeMedia(\""+object["movieId"]+"\") > Remove Media </button>" + "</td>";

        tbody.appendChild(tr);
        table.appendChild(tbody);
    });

}
//--------------------------------------------------------------------------------

function openAddMedia(){

    // Display side window
    let element = document.getElementById("div_media_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);
    $("select").attr("disabled", true);
    $("button.add_actor_button").attr("disabled", true);

    $("#seasons-group").hide();
    $("#episodes-group").hide();

    // Make all fields empty
    $("#id_field").val("");
    $("#name_field").val("");
    $("#pic_url_field").val("");
    $("#director_field").val("");
    $("#date_field").val("");
    $("#rating_field").val(3);
    $("#is_series_field").prop('checked', false);
    $("#seasons_field").val("")
    $("#episodes_field").val("");
    
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

function openAddActor(){
    
    let element = document.getElementById("div_actor_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);
    $("select").attr("disabled", true);

    // Make all fields empty
    $("#actor_name_field").val("");
    $("#actor_pic_url_field").val("");
    $("#actor_page_url_field").val("");
}

function openUpdateMedia(media_id){

    // Display side window
    let element = document.getElementById("div_update_media_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);
    $("select").attr("disabled", true);
    $("button.add_actor_button").attr("disabled", true);

    curr_update_media_id = media_id;
    let media = mediaData.find(x => x.movieId === media_id);

    // Convert needed fields from json format
    var date = media.date.split("-").reverse().join("-");

    if (media.isSeries == true){
        $("#update_is_series_field").prop('checked', true);
        $("#update_seasons_field").val(media.series_details.length)
        $("#update_episodes_field").val(media.series_details);
    }
    else{
        $("#update_is_series_field").prop('checked', false);
        $("#update_seasons_field").val("")
        $("#update_episodes_field").val("");
    }

    $("#update_name_field").val(media.name);
    $("#update_pic_url_field").val(media.picture);
    $("#update_director_field").val(media.director);
    $("#update_date_field").val(date);
    $("#update_rating_field").val(media.rating);
}

function openAddActorToMedia(media_id){
    
    curr_update_media_id= media_id;

    let element = document.getElementById("div_add_actor_to_media_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);
    $("#sorts_list").attr("disabled", true);

    GetActors();

    $('#actors_list').empty(); 

    actorsData.forEach(function(object) {
        $("#actors_list").append("<option value=" + object["_id"] + ">" + object["name"] + "</option>");                 
    });
}

function openViewActors(media_id)
{
    curr_update_media_id= media_id;

    let element = document.getElementById("div_view_actor_form")
    element.style.display = "block";

    // Disable action buttons while media pop-up window is open
    $("button.action_btn").attr("disabled", true);
    $("select").attr("disabled", true);

    var table = document.getElementById("actorsTB");

    table.innerHTML = "<thead><tr> <th>Name</th> <th>Picture</th> <th>Page</th> <th>Action</th> </tr></thead>";

    $.ajax({
        url: "/list/"+media_id,
        success: function (result) {

            let actors = result[0]["actors"];
            $.each(actors, function(index, value) {
                var tr = document.createElement('tr');
                tr.innerHTML =  '<td>' + value["name"] + '</td>' +
                                '<td>' + '<img src = "' + value["picture"] + '"/img>' + '</td>' +
                                '<td>' + value["site"] + '</td>' +
                                '<td>'+ "<button id = \"" + media_id + "_" + value["name"] + "_removeActor" + "\" onclick = removeActor(\""+value["_id"]+"\") > delete </button></td>";
        
                table.appendChild(tr);
            }); 
        },
        error: function (err) {
          console.log("err", err);
        }
      });
}
//--------------------------------------------------------------------------------

function closeAddMedia(){

    let element = document.getElementById("div_media_form")
    element.style.display = "none";

    $("button.action_btn").attr("disabled", false);
    $("select").attr("disabled", false);
    $("button.add_actor_button").attr("disabled", false);

}

function closeAddActor(){
    let element = document.getElementById("div_actor_form")
    element.style.display = "none";

    $("button.action_btn").attr("disabled", false);
    $("select").attr("disabled", false);
}

function closeUpdateMedia(){ 

    let element = document.getElementById("div_update_media_form")
    element.style.display = "none";

    $("button.action_btn").attr("disabled", false);
    $("select").attr("disabled", false);
    $("button.add_actor_button").attr("disabled", false);
}

function closeAddActorToMedia(){
    let element = document.getElementById("div_add_actor_to_media_form")
    element.style.display = "none";

    $("button.action_btn").attr("disabled", false);
    $("select").attr("disabled", false);
}

function closeViewActor(){
    let element = document.getElementById("div_view_actor_form")
    element.style.display = "none";

    $("button.action_btn").attr("disabled", false);
    $("select").attr("disabled", false);
}
//--------------------------------------------------------------------------------

function validateAddMedia(){

    // Deeper Form Validation

    var media_id = $("#id_field").val();

    // Check if media_id already exists in JSON
    mediaData.forEach(function (object) {
        if (object["movieId"] == media_id)
            alert("Another media with the same ID already exists.\n" +
                    "Please pick another ID.");
            return false;
    });

    // Check if this is a series => seasons and episodes were entered
    if ($('#is_series_field').is(":checked"))
    {
        var seasons = $("#seasons_field").val();
        var episodes = $("#episodes_field").val();

        if (seasons == "")
        {
            alert("Media was checked as series but number of seasons is missing.\n" +
                    "Please enter number of seasons.");
            return false;
        }

        if (seasons == 0)
        {
            alert("Media was checked as series but number of seasons is 0.\n" +
                    "Please enter uncheck series checkbox.");
            return false;
        }

        if (episodes == "")
        {
            alert("Media was checked as series but number of episodes in each season is missing.\n" +
                    "Please enter number of episodes for each season.");
            return false;
        }

        if (episodes == 0)
        {
            alert("Media was checked as series but number of episodes in each season is 0.\n" +
                    "Please enter a valid number of episodes for each season.");
            return false;
        }

        // Check episodes match valid pattern
        var episodes_str = $("#episodes_field").val();
        if(episodes_str.match(/[a-z]/) || episodes_str.match(/[A-Z]/))
        {
            alert("Number of episodes field contain invalid characters.\n" +
                "Please follow the pattern shown in the field, without letters or spaces, only digits and ','");
            return false;
        }

        // Get series details
        let series_details = [];
        series_details = $("#episodes_field").val().split(",");

        // Check episodes match number of seasons
        if (series_details.length != seasons) 
        {
            alert("Media was checked as series but number of episodes in each season doesn't match number of seasons.\n" +
                    "Please enter number of episodes for each season.");
            return false;
        }
    }

    return true;
}

function validateUpdateMedia(){

    // Deeper Form Validation

    // Check if this is a series => seasons and episodes were entered
    if ($('#update_is_series_field').is(":checked"))
    {
        var seasons = $("#update_seasons_field").val();
        var episodes = $("#update_episodes_field").val();

        if (seasons == "")
        {
            alert("Media was checked as series but number of seasons is missing.\n" +
                    "Please enter number of seasons.");
            return false;
        }

        if (seasons == 0)
        {
            alert("Media was checked as series but number of seasons is 0.\n" +
                    "Please enter uncheck series checkbox.");
            return false;
        }

        if (episodes == "")
        {
            alert("Media was checked as series but number of episodes in each season is missing.\n" +
                    "Please enter number of episodes for each season.");
            return false;
        }

        if (episodes == 0)
        {
            alert("Media was checked as series but number of episodes in each season is 0.\n" +
                    "Please enter a valid number of episodes for each season.");
            return false;
        }

        // Check episodes match valid pattern
        var episodes_str = $("#update_episodes_field").val();
        if(episodes_str.match(/[a-z]/) || episodes_str.match(/[A-Z]/))
        {
            alert("Number of episodes field contain invalid characters.\n" +
                "Please follow the pattern shown in the field, without letters or spaces, only digits and ','");
            return false;
        }

        // Get series details
        let series_details = [];
        series_details = $("#update_episodes_field").val().split(",");

        // Check episodes match number of seasons
        if (series_details.length != seasons) 
        {
            alert("Media was checked as series but number of episodes in each season doesn't match number of seasons.\n" +
                    "Please enter number of episodes for each season.");
            return false;
        }
    }

    return true;
}

//--------------------------------------------------------------------------------

function submitAddMedia(){
    
    // Set validation restrictions for the form
    $("form[id='media_form']").validate({
        
        // Specify validation rules
        rules: {
        "id_field":{
            required: true
        },
        "name_field": {
            required: true,
            text: true
        },
        "pic_url_field":{
            required: true,
            url : true
        },
        "director_field":{
            required: true,
            text: true
        },
        "date_field":{
            required : true
        },
        "seasons_field":{
            digits : true
        },
        // Specify validation error messages
        messages: {       
        director_field:{
            text: "Please enter letters only."
        },
        date_field: {
            required : "Please pick a date."
        },
        seasons_field: "Please enter digits only."
        }
    }});
    
    if(!$("#media_form").valid()) return;

    if (!validateAddMedia()) return;
    
    //-------------------------------------------

    // Convert needed fields to match json format
    var is_series = false;
    let series_details = [];

    if ($('#is_series_field').is(":checked"))
    {
        is_series = true;
        series_details = $("#episodes_field").val().split(",");

        // Fill series_details - length is number of seasons, each cell is number of episodes in season
        for (let i = 0; i < series_details.length; i++) {
            series_details[i] = Number(series_details[i]);
        } 
    }

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
            fillTable("default");
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("media not added!");
        }
    })
}

function submitAddActor()
{

    // Set validation restrictions for the form
    $("form[id='actor_form']").validate({
        
        // Specify validation rules
        rules: {
        "actor_name_field": {
            required: true,
            text: true
        },
        "actor_pic_url_field":{
            required: true,
            url : true
        },
        "actor_page_url_field":{
            required: true,
            url: true
        }
    }});
    
    if(!$("#actor_form").valid()) return;
    
    //-------------------------------------------

    $.ajax({
        type: 'POST', 
          url: '/actor', 
          contentType: 'application/json',
          data: JSON.stringify({
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
            alert("new actor added!");
            closeAddActor();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("actor not added!");
        }
    });
    
    /*
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
      });*/
}

function submitAddActorToMedia()
{
    let media = mediaData.find(x => x.movieId === curr_update_media_id);
    let actor_id = $("#actors_list").val(); // chosen actor from list
    
    $.ajax({
        type: 'PUT', 
        url: '/actor/'+curr_update_media_id, 
        contentType: 'application/json',
        data: JSON.stringify({
            "movie_id": media._id,
            "actor_id": actor_id
            }),
        processData: false,            
        encode: true,
        success: function( data, textStatus, jQxhr ){
            //console.log(data);
            alert("actor updated!");
            closeAddActorToMedia();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("actor not updated!");
        }
        });
    
}

function submitUpdateMedia(){

    // Set validation restrictions for the form
    $("form[id='update_media_form']").validate({
        
        // Specify validation rules
        rules: {
        "update_name_field": {
            required: true,
            text: true
        },
        "update_pic_url_field":{
            required: true,
            url : true
        },
        "update_director_field":{
            required: true,
            text: true
        },
        "update_date_field":{
            required : true
        },
        "update_seasons_field":{
            digits : true
        },
        // Specify validation error messages
        messages: {       
        director_field:{
            text: "Please enter letters only."
        },
        date_field: {
            required : "Please pick a date."
        },
        seasons_field: "Please enter digits only."
        }
    }});
    
    if(!$("#update_media_form").valid()) return;

    if (!validateUpdateMedia()) return;
    
    //-------------------------------------------

    // Convert needed fields to match json format
    var is_series = false;
    let series_details = [];

    if ($('#update_is_series_field').is(":checked"))
    {
        is_series = true;
        series_details = $("#update_episodes_field").val().split(",");

        for (let i = 0; i < series_details.length; i++) {
            series_details[i] = Number(series_details[i]);
        } 
    }
    
    let media = mediaData.find(x => x.movieId === curr_update_media_id);

    // process the form
    $.ajax({
        type: 'PUT', 
        url: '/movie/'+curr_update_media_id, 
        contentType: 'application/json',
        data: JSON.stringify({
            "movie_id": media._id,
            "movieDetails":{
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
            alert("media updated!");
            closeUpdateMedia();
            fillTable("default");
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            alert("media not updated!");
        }
    })
}
//--------------------------------------------------------------------------------
function removeMedia(media_id)
{
    //let media = mediaData.find(x => x[Object.keys(x)[0]] === media_id);
    let media = mediaData.find(x => x.movieId === media_id);

    if (confirm('Are you sure you want to delete '+ media.name +'?')) {
        $.ajax({
            type: 'DELETE', // define the type of HTTP verb we want to use (POST for our form)
              url: '/movie/'+ media._id, // the url where we want to POST
              contentType: 'application/json',
            success: function (result) {
                alert("media deleted");
                fillTable("default");
            },
            error: function (err) {
              console.log("err", err);
            }
          });
      } 
      else {}
    
}

function removeActor(actor_id)
{
    GetActors();
    let media = mediaData.find(x => x.movieId === curr_update_media_id);
    let actor = actorsData.find(x => x._id === actor_id)

    console.log(actor_id);
    console.log(actor);

    if (confirm('Are you sure you want to delete '+ actor.name +'?')) {
        $.ajax({
            type: 'DELETE', // define the type of HTTP verb we want to use
            url: '/actor/'+curr_update_media_id, // the url where we want to DELETE
            contentType: 'application/json',
            data: JSON.stringify({
                "movie_id": media._id,
                "actor_id": actor._id
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