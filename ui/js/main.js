
var isPlaying = true;
var allCommits;
var currentScene = 0;
var animationScheduled = false;
var speed = 1000;

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

    }
    initSlider();
    runVisual();

}

function runVisual(){
    if(!isPlaying || currentScene + 1 == allCommits.length) {
        animationScheduled = false;
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
            beginAnimation(root2);
        });
        }
    );
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

        $( "#play" ).button({
            text: false,
            icons: {
                primary: "ui-icon-pause"
            }
        })
            .click(function() {
                var options;
                if ( $( this ).text() === "play" ) {
                    options = {
                        label: "pause",
                        icons: {
                            primary: "ui-icon-pause"
                        }
                    };
                } else {
                    options = {
                        label: "play",
                        icons: {
                            primary: "ui-icon-play"
                        }
                    };
                }
                $( this ).button( "option", options );
                //alert('test');
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

function onSpeedChanged(event, ui){
    var normal = 4;
    var val = ui.value;
    var times = ui.value/normal;
    speed = 1000 / times;
    $("#speed-val").text(times + "x");

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
