const dataPath = '././server/data/dataMediaDB.json';

$(document).ready(function () {

    const table = $("#listMediaTB").DataTable({
        
        "data": dataPath,
        "columns": [

            {"data:":"items"},
            {"data":"items.0.name"},
            {"data":"items.0.name"},
            {"data":"items.0.name"},
            {"data":"items.0.name"}
        ]
    });

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

    /*
    var table = document.getElementById("listMediaTB");
    var tr = document.createElement('tr');
    tr.innerHTML =  '<th>' + "Media ID" + '</th>' +
                    '<th>' + "Name" + '</th>' +
                    '<th>' + "Image"+ '</th>' +
                    '<th>' + "Rating" + '</th>' +
                    '<th>' + "Date" + '</th>';
    table.appendChild(tr);
    */
    
});

function fillTable(xml)
{
    // Javascript function JSON.parse to parse JSON data
    //const jsonObj = JSON.parse(xml.responseText);
    const jsonObj = xml;

    console.log(jsonObj);
    
    var table = document.getElementById("listMediaTB");
    var tr = document.createElement('tr');
        tr.innerHTML = '<th>' + "Name" + '</th>' +
                    '<th>' + "Image" + '</th>' +
                    '<th>' + "Type"+ '</th>' +
                    '<th>' + "Diet" + '</th>' +
                    '<th>' + "Lifespan" + '<br>' + "(in years)" + '</th>' +
                    '<th>' + "Min & Max Length" + '<br>' + "(in meters)" + '</th>' +
                    '<th>' + "Min & Max Weight" + '<br>' + "(in kgs)" + '</th>' +
                    '<th>' + "Weekly views on Wikipedia" + '</th>';
        table.appendChild(tr);
    
    jsonObj.forEach(function(object) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + object["name"] + '</td>' +
                    '<td>' + '<img src=' + object["image_link"] + '>' + '</td>' +
                    '<td>' + object.animal_type + '</td>' +
                    '<td>' + object.diet + '</td>' +
                    '<td>' + object.lifespan + '</td>' +
                    '<td>' + (object.length_min * 0.3048).toFixed(2) + "m up to " + (object.length_max * 0.3048).toFixed(2) + "m" + '</td>' +
                    '<td>' + (object.weight_min * 0.4535924).toFixed(2) + "kg up to " + (object.weight_max * 0.4535924).toFixed(2) + "kg" + '</td>';
        table.appendChild(tr);
        getViewsJSON(object,tr);
    });
}