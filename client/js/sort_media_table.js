
 $(document).ready(function () {
    
    $("#sorts_list").on('change', function() {

        // Fill media table with this kind of sort
        fillTable(this.value);
      });
 });

// Sorting Functions
//--------------------------------------------

// Sort all media by name, ascending
function sortNameAsc(mediaData){
    
    return mediaData.sort((a, b) => a.name.localeCompare(b.name));
}

// Sort all media by name, descending
function sortNameDec(mediaData){
    
    return mediaData.reverse(mediaData.sort((a, b) => a.name.localeCompare(b.name)));
}

// Sort all media by rating, ascending
function sortRatingAsc(mediaData) {

    return mediaData.sort(function (a,b) {
        return a["rating"] - b["rating"];
    });
}

// Sort all media by rating, descending
function sortRatingDec(mediaData) {

    return mediaData.sort(function (a,b) {
        return b["rating"] - a["rating"];
    });
}

// Sort all media by date, ascending
function sortDateAsc(mediaData){
    
    return mediaData.sort(function (a,b) {

        const date1 = new Date(a["date"].split("-").reverse().join("-"))
        const date2 = new Date(b["date"].split("-").reverse().join("-"))
        
        return date1 - date2;
    });
}

 // Sort all media by date, descending
function sortDateDec(mediaData){
    
    return mediaData.sort(function (a,b) {

        const date1 = new Date(a["date"].split("-").reverse().join("-"))
        const date2 = new Date(b["date"].split("-").reverse().join("-"))
        
        return date2 - date1;
    });
}

