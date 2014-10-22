/**
 * Created by gurkaran on 2014-10-17.
 */

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
 * Callback for JSON parser, begins the animation for the provided data
 *
 * @param data The JavaScript "commits" object to be animated
 */
function beginAnimation(data) {
    var numCommits = data.commits.length;

    // This loop is where all the commits will be analyzed and displayed in UI
    for(var i = 0; i < numCommits; i++) {

        // TODO: We may want to eventually add a real timer here to depict constant time frames
        var currCommit = data.commits[i];
        var numFiles = currCommit.length;

        // This list contains a list of Bubbles that will be created
        // (each bubble represents a file visual)
        var commitFileVisuals = [];

        // This loop populates the list of bubbles based on current commit
        for(var j = 0; j < numFiles; j++) {

            // Create the file visual object based on required visual (bubble in this case)
            var newFileVisualObject = createBubbleObject(currCommit[j]);

            commitFileVisuals.push(newFileVisualObject);
        }

        // clear the canvas for next "frame"
        clearCanvas();

        // create the next set of bubbles (ie: frame) obtained from the current commit
        createFrame(commitFileVisuals);
    }
}

/**
 * Clear the canvas of the webpage
 */
function clearCanvas() {
    // TODO Clear <p> for now, eventually will be SVG
    d3.select("body").selectAll("p").remove();
}

/**
 * Create the "frame" with the appropriate file visual images
 *
 * @param fileVisualObject The list of file visual objects
 */
function createFrame(fileVisualObject) {
    var numBubbles = fileVisualObject.length;

    for (var i = 0; i < numBubbles; i++) {

        // Create the appropriate image/visual (bubble in this case)
        createBubbleImage(fileVisualObject[i]);
    }
}

/**
 * Main function that starts program execution
 */
function main() {
    // TODO: Use MOCK data for now
    loadJSON(
        "sample.json",
        beginAnimation,
        function(xhr) { document.write("Error getting JSON data from file"); }
    );
}

// Call the main function to start program execution
main();
