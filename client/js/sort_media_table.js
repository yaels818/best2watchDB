
 $(document).ready(function () {
    
    var tables = $("table.sortable");
    var table, thead, headers, i, j, title;

    /**
     * Inject hyperlinks, into the column headers of sortable tables, which sort
     * the corresponding column when clicked.
     */
    for (i = 0; i < tables.length; i++) {
        table = tables[i];
       
        if (thead = table.querySelector("thead")) {
            headers = thead.querySelectorAll("th");
            
            for (j = 0; j < headers.length; j++) {
                title = headers[j].innerText;
                if (title == "Name" || title == "Rating" || title == "Release Date"){
                    headers[j].innerHTML = "<a href='#'>" + headers[j].innerText + "</a>";
                }
            }

            /* cellIndex is the number of th:
            *  0 for the first column, 1 for the second, etc.
            */
            
            thead.addEventListener("click", sortGrid(thead.cellIndex, thead.dataset.type));
        }
    }

    function sortGrid(colNum, type) {
        console.log(colNum + "," + type);

        let tbody = table.querySelector('tbody');
    
        let rowsArray = Array.from(tbody.rows);
    
        // compare(a, b) compares two rows, need for sorting
        let compare;
    
        switch (type) {
            case 'number':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            };
            break;
            case 'string':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
            };
            break;
        }
    
        // sort
        rowsArray.sort(compare);
    
        tbody.append(...rowsArray);
    }
});