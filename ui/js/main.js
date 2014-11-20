
var isPlaying = true; // Is the visual playing?
var allCommits; //List of all the commits that were analyzed. (A list of lists of bubble objects).
var currentScene = 0; // The current scene show on visualizaiton.
var animationScheduled = false; //Whether a transition is in progress
var speed = 1000; //  Delay between scene changes.

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
    }
    initSlider();
    runVisual();

}

/**
 * If isPlaying is set to true, create a visual for the next commit.
 * Also schedule this method to run again in "speed" milliseconds.
 * Otherwise set play button to pause icon and do nothing more.
 */

function runVisual(){
    if(!isPlaying || currentScene + 1 >= allCommits.length) {
        animationScheduled = false;
        isPlaying = false;
        setPlayBtnIcon(!isPlaying);
        return;
    }
    updateSlider();
    createVisual(allCommits[currentScene]);
    setTimeout(function() {
        currentScene++;
        animationScheduled = true;
        runVisual();
    }, speed); // Time elapse between consecutive frames in milliseconds
}

function updateSlider(){
    $("#slider").slider('option', 'value', currentScene);
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
            setRepoName(root.repo_name);
            beginAnimation(root2);
        });
        }
    );
}

/**
 * @param name The name of the repository being analyzed
 */
function setRepoName(name){
    $("#repo-name").text(name);
}

/**
 * Set the play button to either play, or pause
 * Replay will be used if current scene higher or equal to
 * number of commits.
 */

function setPlayBtnIcon(setPlayIcon){
    var options;
    if(setPlayIcon){
        if(currentScene + 1 >= allCommits.length) {
            options = {
                label: "replay",
                icons: {primary: "ui-icon-seek-first"}
            };
        } else{
            options = {
                label: "play",
                icons: {primary: "ui-icon-play"}
            };
        }
    } else {
        options = {
            label: "pause",
            icons: {
                primary: "ui-icon-pause"
            }
        };
    }
    $( "#play" ).button( "option", options );
}

/**
 * Initialize the seek bar, speed bar, and play button
 */
function initSlider(){
    $("#slider").slider(
        {
            min: 0,
            max: allCommits.length - 2,
            step: 1,
            animate: true,
            slide: onSliderChanged

        });
        $( "#play" ).button({
            text: false,
            icons: {
                primary: "ui-icon-pause"
            }
        })
            .click(function() {
                if ( $( this ).text() === "play" ) {
                    setPlayBtnIcon(false);
                } else {
                    setPlayBtnIcon(true);
                }
                if(currentScene + 1 >= allCommits.length) {
                    $("#slider").slider("option", "value", 0);
                    currentScene = 0;
                    setPlayBtnIcon(false);
                }
                isPlaying = !isPlaying;
                if(!animationScheduled) //make sure run visual isn't running twice
                    runVisual();
            });


    $( "#speed-bar" ).slider(
        {
            min: 1,
            max: 8,
            value: 4,
            step: 1,
            animate: false,
            slide: onSpeedChanged
        });
}

/**
 * Callback when user changes speed bar position
 * The speed of the visual is changed based on
 * position of speed bar handle.
 */
function onSpeedChanged(event, ui){
    var normal = 4;
    var val = ui.value;
    if(val>normal){
        if(val==5){
            val = 6;
        } else {
            val = (val - 4) * 4;
        }
    }
    var times = val/normal;
    speed = 1000 / times;
    $("#speed-val").text(times + "x");

}

/**
 * Callback when user changes seek bar position
 * Recreate visual to match commit at the current
 * position of the seek bar handle.
 */
function onSliderChanged(event, ui){
    if(ui.value + 1 >= allCommits.length) {
        isPlaying = false;
        animationScheduled = false;
        setPlayBtnIcon(!isPlaying);
        return;
    }
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
