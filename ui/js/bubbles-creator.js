/**
 * Created by gurkaran on 2014-10-22.
 */

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
    return 400;
}

function getBubbleCentreY() {
    // TODO stub
    return 400;
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