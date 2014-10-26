/**
 * Created by gurkaran on 2014-10-22.
 */
var diameter = 960,
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = null;

function createVisual(data){
    recreateSvg();
    var node = svg.selectAll(".node")
        .data(bubble.nodes({children:data}))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return color(d.color); });
}

function recreateSvg(){

    if(svg!=null){
        svg.remove();
    }
    svg = d3.select("body").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
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
    newBubble.fileName = currFile.fileName;
    newBubble.centreX = getBubbleCentreX();
    newBubble.centreY = getBubbleCentreY();
    newBubble.radius = getBubbleRadius(currFile.complexity);
    newBubble.value = 1;
    newBubble.color = getBubbleColour(currFile.smells);
    return newBubble;
}

/**
 * Create the bubbles image for the given Bubbles
 *
 * @param bubbles The list of bubbles to create the images for
 */
function createBubbleImages(bubbles, svgContainer) {
    // TODO Just creating simple circles for now
    var circles = svgContainer.selectAll("circle")
                              .data(bubbles)
                              .enter()
                              .append("circle");

    var circleAttributes = circles
                           .attr("cx", function (bubble) { return bubble.centreX; })
                           .attr("cy", function (bubble) { return bubble.centreY; })
                           .attr("r", function (bubble) { return bubble.radius; })
                           .style("fill", function(bubble) {return bubble.color;});
}

function getBubbleCentreX() {
    // TODO stub
    return 200;
}

function getBubbleCentreY() {
    // TODO stub
    return 200;
}

function getBubbleRadius(complexity) {
    // TODO stub
    return complexity / 2;
}

function getBubbleColour(smells) {
    // 210 hue is Cyan-blues
    // Saturation=dirtLevel - Change this to depict dirty bubble
    // (0% is completely dirty, 100% is completely clean)
    // 50% lightness is "normal colour"
    // http://www.w3.org/TR/css3-color/#hsl-examples
    // TODO stub
    var dirtLevel = getBubbleDirt(smells);
    return "hsl(210, " + dirtLevel + "%, 50%)";
}

function getBubbleDirt(smells) {
    // TODO stub
    return smells / 2;
}