$(document).ready(function () {

    $(".add_media_button").click(openAddMedia);
    $("#add_btn").click(submitAddMedia);
    $("#close_btn").click(closeAddMedia);

    $.ajax({
        url: "/GetList",
        success: function (result) {
            
            fillTable(result);
            console.log(result);
        },
        error: function (err) {

          console.log("err", err);
        }
    });
    
});

function fillTable(xml)
{
    const jsonObj = xml;
    
    var table = document.getElementById("listMediaTB");

    jsonObj.forEach(function(object) {

        var tr = document.createElement('tr');
        tr.innerHTML =  '<td>' + object["id?"] + '</td>' +
                        '<td>' + object["name"] + '</td>' +
                        '<td>' + '<img src = "' + object["picture"] + '"/img>' + '</td>' +
                        '<td>' + object["rating"] + '</td>' +
                        '<td>' + object["date"] + '</td>';

        table.appendChild(tr);
        //getViewsJSON(object,tr);
    });

    //sortByDate(table);
}

function openAddMedia(){

    document.getElementByClass("form-popup").style.display = "block";
    document.getElementByClass("add_media_button").disabled = true;
}

function closeAddMedia(){

    document.getElementByClass("form-popup").style.display = "none";
    document.getElementByClass("add_media_button").disabled = false;
}

function submitAddMedia(){
    
    //TODO: update according to ajax.txt (each function and its type, url, form fields)
    /*
    // process the form
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: 'http://localhost:3001/users', // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "name": $("#username").val(),
            "password": $("#password").val(),
            "profession": $("#profession").val(),
            "id": $("#id_field").val()
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
    */
    document.getElementByClass("form-popup").style.display = "none";
    document.getElementById("addMedia_btn_1").disabled = false;
    document.getElementById("addMedia_btn_2").disabled = false;
}




