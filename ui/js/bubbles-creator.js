/**
 *  JS file that deals with display logic
 */


// Diameter of the outermost circle in the visual
var width = document.getElementById('vis').clientWidth;//960;
var height = document.getElementById('vis').clientHeight;
// Function that determines ordering of bubbles
function comparator(a, b) {return b.fileName.localeCompare(a.fileName);}
//Using d3.layout.pack to display the bubbles
var bubble = d3.layout.pack()
    .sort(comparator)
    .size([width, height])
    .value(function(d) {return d.complexity;})
    .padding(1.5);

var svg = null;

/**
 * Given an array of bubble objects, displays them on the SVG
 */
function createVisual(data){
    recreateSvg();
    var node = svg.selectAll(".node")
        .data(bubble.nodes({children:data, fileName:"", color:"rgba(255,255,255,0.0)"}))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return d.color; })
    ;

    // Uncomment the following to dispaly class names on bubbles
    /*
    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className; });
    */
}

/**
 * Add a blank SVG to the DOM replacing the previous one if it exists
 */
function recreateSvg(){
    if(svg!=null){
        svg.remove();
    }
    svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#1C6BA0")
        .attr("class", "bubble");
}

/**
 * Creates a bubble object from the given file representation
 *
 * @param currFile the file object to convert into bubble object
 * @returns {{new bubble object created from given file}}
 */
function createBubbleObject(currFile) {
    var newBubble = {}
    var name = currFile.fileName;
    newBubble.className = name.substring(name.lastIndexOf("/")+1, name.lastIndexOf("."));
    newBubble.fileName = name;
    newBubble.complexity = currFile.complexity;
    newBubble.color = getBubbleColour(currFile.smells);
    return newBubble;
}

function getBubbleColour(smells) {
    // 210 hue is Cyan-blues
    // Saturation=dirtLevel - Change this to depict dirty bubble
    // (0% is completely dirty, 100% is completely clean)
    // 50% lightness is "normal colour"
    // http://www.w3.org/TR/css3-color/#hsl-examples
    var dirtLevel = getBubbleDirt(smells);
    return "hsl(210, " + dirtLevel + "%, 50%)";
}

function getBubbleDirt(smells) {
    return smells / 2;
}