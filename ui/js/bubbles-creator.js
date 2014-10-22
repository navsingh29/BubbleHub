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
 * Create the bubble image for the given Bubble
 *
 * @param bubble The bubble to create the image for
 */
function createBubbleImage(bubble) {

    // TODO Just print the bubble details for now
    var curBubbleString = bubble.fileName + ", ";
    curBubbleString = curBubbleString + bubble.centreX + ", ";
    curBubbleString = curBubbleString + bubble.centreY + ", ";
    curBubbleString = curBubbleString + bubble.color;
    document.write("<p>" + curBubbleString + "</p>");
}

function getBubbleCentreX() {
    // TODO stub
    return 0;
}

function getBubbleCentreY() {
    // TODO stub
    return 0;
}

function getBubbleRadius(complexity) {
    // TODO stub
    return complexity * 2;
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