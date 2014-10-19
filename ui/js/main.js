/**
 * Get JSON data from file (without using jQuery)
 *
 * @param path The path of the JSON file
 * @param success The function to call if parsing of JSON file is successful
 * @param error The function to call if parsing fails
 */
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

/**
 * Handle the JSON once its successfully parsed from the JSON file
 *
 * @param data The JavaScript object representing the parsed JSON file
 */
function handleJSON(data) {
    var size = data.commits.length;

    // This loop is where all the commits will be analyzed for UI
    for(var i = 0; i < size; i++) {

        // We may want to eventually add a timer here to depict constant time frames

        // For now, just print the data to the page
        var curr = data.commits[i];
        var currContent = "<p>" + curr.complexity + ", " + curr.smells + "</p>";
        document.write(currContent);
    }
}

/**
 * Main function that starts program execution
 */
function main() {
    // Use MOCK data for now
    loadJSON('mock-commits-data.json',
        handleJSON,
        function(xhr) { document.write("Error getting JSON data from file"); }
    );
}

// Call the main function to start program execution
main();
