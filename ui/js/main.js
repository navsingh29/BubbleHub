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
        var commitBubbles = [];

        // This loop populates the list of bubbles based on current commit
        for(var j = 0; j < numFiles; j++) {
            var newBubble = {}
            var currFile = currCommit[j];
            newBubble.fileName = currFile.fileName;
            newBubble.centreX = i; // TODO stub
            newBubble.centreY = i; // TODO stub
            // 210 hue is Cyan-blues
            // 100% saturation
            // 50% lightness is "normal"
            // http://www.w3.org/TR/css3-color/#hsl-examples
            newBubble.color = "hsl(210, 100%, 50%)"; // TODO stub
            commitBubbles.push(newBubble);
        }

        // clear the canvas for next "frame"
        clearCanvas();

        // create the next set of bubbles (ie: frame) obtained from the current commit
        createBubbles(commitBubbles);
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
 * Create the "frame" with the appropriate bubble images
 *
 * @param bubbles The list of Bubbles, where each Bubble represents a File Visual
 */
function createBubbles(bubbles) {
    var numBubbles = bubbles.length;

    for (var i = 0; i < numBubbles; i++) {
        var currBubble = bubbles[i];

        // TODO Just print the bubble details for now
        var curBubbleString = currBubble.fileName + ", ";
        curBubbleString = curBubbleString + currBubble.centreX + ", ";
        curBubbleString = curBubbleString + currBubble.centreY + ", ";
        curBubbleString = curBubbleString + currBubble.color;
        document.write("<p>" + curBubbleString + "</p>");
    }
}

/**
 * Main function that starts program execution
 */
function main() {
    // TODO: Use MOCK data for now
    loadJSON(
        "mock-commits-data.json",
        beginAnimation,
        function(xhr) { document.write("Error getting JSON data from file"); }
    );
}

// Call the main function to start program execution
main();
