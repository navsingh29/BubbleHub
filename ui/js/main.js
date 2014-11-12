/**
 * Created by gurkaran on 2014-10-17.
 */

var isPlaying = true;
var allCommits = [];
var currentScene = 0;
var animationScheduled = false;
var allCommitObjects = [];

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
        var commitFileObjects = {};
        // This loop populates the list of bubbles based on current commit
        for(var j = 0; j < numFiles; j++) {
            // Create the file visual object based on required visual (bubble in this case)
            var newFileVisualObject = createBubbleObject(currCommit[j]);
            commitFileVisuals.push(newFileVisualObject);
            commitFileObjects[newFileVisualObject.fileName] = newFileVisualObject;
        }
        allCommitObjects.push(commitFileObjects);
        allCommits.push(commitFileVisuals);
        /*
        function sleepy() {
            var c = commitFileVisuals; // Use a closure to hold onto this value
            setTimeout(function() { createVisual(c); }, i * 1000);
        }
        sleepy();
        */
    }
    runVisual();

}

function runVisual(){
    if(!isPlaying || currentScene + 1 == allCommits.length) {
        animationScheduled = false;
        return;
    }
    createVisual(allCommits[currentScene], allCommitObjects[currentScene - 1]);
    setTimeout(function() {
        currentScene++;
        animationScheduled = true;
        runVisual();
    }, 1000);
}

function getDataUsingD3(){
    var configFile = "config.json";
    d3.json(configFile, function(error, root) {
            if(error)
                alert("Error retrieving commit data from JSON file. Please try using a different browser.");
        d3.json(root.input_json, function(error2, root2) {
            beginAnimation(root2);
        });
        }
    );
}

function onPlay(buttonElem){
    isPlaying = !isPlaying;
    if(isPlaying)
        buttonElem.innerHTML = "&#9612;&#9612;";
    else
        buttonElem.innerHTML = " &#9658; ";
    if(!animationScheduled) //make sure run visual isn't running twice
        runVisual();
}

function onReplay(buttonElem){
    //alert('hi');

    if(!animationScheduled) { //make sure run visual isn't running twice
        isPlaying = true;
        currentScene = 0;
        runVisual();
    }
}


/**
 * Main function that starts program execution
 */
function main() {
    getDataUsingD3();
}

// Call the main function to start program execution
main();
