/**
 *  JS file that deals with display logic
 */

var OUTER_BUBBLE_INC = 30;
var INNER_BUBBLES_INC = 0;
// Diameter of the outermost circle in the visual
var width = document.getElementById('vis').clientWidth;//960;
var height = document.getElementById('vis').clientHeight;
// Function that determines ordering of bubbles
function comparator(a, b) {return b.fileName.localeCompare(a.fileName);}
//Using d3.layout.pack to display the bubbles
var bubble = d3.layout.pack()
    .sort(comparator)
    .size([width-10, height-10])
    .value(function(d) {return d.complexity;})
    .padding(1.5);

var svg = null;
var oldData = [];

// Tooltip code taken from http://bl.ocks.org/biovisualize/1016860
var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
       .style("position", "absolute")
       .style("z-index", "10")
       .style("visibility", "hidden")
    ;


/**
 * Given an array of bubble objects, displays them on the SVG
 */
function createVisual(data){
    recreateSvg();
    var node = svg.selectAll(".node")
        .data(bubble.nodes({children:data, fileName:"", color:"rgba(51,153,255,0.1)"}))
        .enter().append("g")
        .attr("class", function(d){
                if(d.fileName=="")
                    return "node";
                else
                    return "node bubble";
            })
        .attr("transform", function(d) {
            if(d.fileName==""){
                return "translate(" + d.x + "," + d.y + ")";
            }

            for(var i = 0; i<oldData.length; i++){
                    if(oldData[i].fileName==d.fileName) {
                        function translate(){
                            return "translate(" + oldData[i].x + "," + oldData[i].y + ")";
                        }
                        return translate();
                    }
            }
            return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("title", function(d) {return d.className; })
        .attr("stroke-width", function(d){
            if($(this).is(':hover')){
                alert("hi");
                return "4px";
            } else {
                return 0;
            }
        })
        // Create a tooltip when mouse hovers over a bubble
        // Tooltip code taken from http://bl.ocks.org/biovisualize/1016860
        .on("mouseover", function(d){
            if(d.fileName!="") {
                $(this).attr("stroke-width","4px");
                $(this).attr("stroke", "rgba(158,202,237,0.5)");
                tooltip.text(d.className);
                return tooltip.style("visibility", "visible");
            }
        })
        .on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(d){
            $(this).attr("stroke-width","0px");
            return tooltip.style("visibility", "hidden");
        });

        ;


    /**
     *  Return the old radius of a file.
     */
    function parseRadius(d){
        if(d.fileName==""){
            return getRadius(d);
        }
        for(var i = 0; i<oldData.length; i++){
            if(oldData[i].fileName==d.fileName) {
                return getRadius(oldData[i]);
            }
        }
        return 0;
    }

    /**
     * Get the radius from a d3 pack object.
     */
    function getRadius(d){
        if(d.fileName=="")
            return d.r + OUTER_BUBBLE_INC;
        else
            return d.r + INNER_BUBBLES_INC;
    }

    node.append("image")
        .attr("xlink:href", function(d) {
            if(d.fileName == "")
                return "img/bubble_outer.png"; // The outer bubble has a different background image
            else
                return "img/bubble2.png";
        })
        .attr("height", function(d) { return 2 * parseRadius(d); })
        .attr("width", function(d) { return 2 * parseRadius(d); })
        .attr("x", function(d) { return -1 * parseRadius(d); })
        .attr("y", function(d) { return -1 * parseRadius(d); })
    ;

    node.append("circle")
        .attr("r", function(d) {
            return parseRadius(d);
        })
        .style("fill", function(d) { return d.color; })
    ;

    /**
     *  If file changed location/size, animate the transition.
     */
    svg.selectAll("circle")
        .transition()
        .duration(speed)
        .attr("r", function(d) {
            return getRadius(d);
        });

    svg.selectAll(".node")
        .transition()
        .duration(speed)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    ;
    svg.selectAll("image")
        .transition()
        .duration(speed)
        .attr("height", function(d) { return 2 * getRadius(d); })
        .attr("width", function(d) { return 2 * getRadius(d); })
        .attr("x", function(d) { return -1 * getRadius(d); })
        .attr("y", function(d) { return -1 * getRadius(d); })
    ;

    oldData = data;

}

/**
 * Add a blank SVG to the DOM replacing the previous one if it exists
 *  Recreate SVG for every new scene
 */
function recreateSvg(){
    tooltip.style("visibility", "hidden"); // Hide tooltip when scene changes
    if(svg!=null){
        svg.remove();
    }
    svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height)
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
    return "hsla(210, " + dirtLevel + "%, 50%, 0.7)";
}

function getBubbleDirt(smells) {
    return smells / 2;
}