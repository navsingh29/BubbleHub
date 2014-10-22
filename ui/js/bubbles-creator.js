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
    newBubble.centreX = 0; // TODO stub
    newBubble.centreY = 1; // TODO stub
    // 210 hue is Cyan-blues
    // 100% saturation
    // 50% lightness is "normal"
    // http://www.w3.org/TR/css3-color/#hsl-examples
    newBubble.color = "hsl(210, 100%, 50%)"; // TODO stub
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