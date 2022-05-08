const dataPath = '././server/data/dataMediaDB.json';

$(document).ready(function () {

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
}