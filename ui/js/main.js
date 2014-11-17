
var isPlaying = true;
var allCommits;
var currentScene = 0;
var animationScheduled = false;

/**
 * Callback for JSON parser, begins the animation for the provided data
 *
 * @param data The JavaScript "commits" object to be animated
 */
function beginAnimation(data) {
    var numCommits = data.commits.length;
    allCommits = [];
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

        allCommits.push(commitFileVisuals);
        initSlider();
    }
    runVisual();

}

function runVisual(){
    if(!isPlaying || currentScene + 1 == allCommits.length) {
        animationScheduled = false;
        return;
    }
    $("#slider").slider('option', 'value', currentScene);
    createVisual(allCommits[currentScene]);
    setTimeout(function() {
        currentScene++;
        animationScheduled = true;
        runVisual();
    }, 1000); // Time elapse between consecutive frames in milliseconds
}

/**
 * Load the data from the JSON file.
 */
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
/**
 * Callback for clicking the play button.
 */
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

function initSlider(){
    $("#slider").slider(
        {
            min: 0,
            max: allCommits.length,
            step: 1,
            animate: true,
            slide: onSliderChanged

        });
}

function onSliderChanged(event, ui){
    currentScene = ui.value;
    createVisual(allCommits[currentScene]);
}

/**
 * Main function that starts program execution
 */
function main() {
    getDataUsingD3();

}

// Call the main function to start program execution
main();
