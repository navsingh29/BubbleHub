/**
 * Created by gurkaran on 2014-10-22.
 */
var diameter = 960;
function comparator(a, b) {return b.fileName.localeCompare(a.fileName);}


var bubble = d3.layout.pack()
    .sort(comparator)
    .size([diameter, diameter])
    .value(function(d) {return (d.radius)^2;})
    //.value(function(d) {return d.fileName;})
    .padding(1.5);

var svg = null;

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
        .text(function(d) {
            var name = d.className;
            return name;});
    */
}

function recreateSvg(){
    if(svg!=null){
        svg.remove();
    }
    svg = d3.select("body").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
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