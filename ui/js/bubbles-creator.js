/**
 *  JS file that deals with display logic
 */


// Diameter of the outermost circle in the visual
var width = document.getElementById('vis').clientWidth;//960;
var height = document.getElementById('vis').clientHeight;
// Function that determines ordering of bubbles
function comparator(a, b) {return b.fileName.localeCompare(a.fileName);}
//Using d3.layout.pack to display the bubbles
/*
var bubble = d3.layout.pack()
    .sort(comparator)
    .size([width, height])
    .value(function(d) {return d.complexity;})
    .padding(1.5);
*/
var nodes = [];

var force = d3.layout.force()
            .nodes(nodes)
            .links([])
            .size([width, height])
/*
            .friction(0.9)
            .charge(-30)
            .gravity(0.05)
        .alpha(1.00)
*/
            ;


var svg = null;
/*
var vis = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .size([width, height]);

force.on("tick", function(e) {
    vis.selectAll("circle")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

setInterval(function(){

    // Add a new random shape.
    nodes.push({
        type: d3.svg.symbolTypes[~~(Math.random() * d3.svg.symbolTypes.length)],
        size: Math.random() * 300 + 100
    });

    // Restart the layout.
    force.start();

    vis.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", "10")
        .style("fill",  "rgba(251,153,255,0.9)")
 //       .attr("d", d3.svg.symbol()
 //           .size(function(d) { return d.size; })
 //           .type(function(d) { return d.type; }))

        .call(force.drag);

}, 1000);
*/

force.on("tick", function(e) {
    if(svg!=null)
        svg.selectAll("circle")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

/**
 * Given an array of bubble objects, displays them on the SVG
 */
function createVisual(data){
    recreateSvg();
    //nodes.push(data);

    for(var i = 0; i < data.length; i++){
        var oldObj = null;
        for(var j = 0; j < nodes.length; j++){
            if(nodes[j].fileName == data[i].fileName)
                oldObj = nodes[i];
        }
        if(oldObj != null) {
            data[i].px = oldObj.x;
            data[i].py = oldObj.y;
        }
    }


/*
    if(oldObj != null){
        for(var i = 0; i < data.length; i++){
            var newObj = data[i];
            var oldVal = oldObj[newObj.fileName];
            if(typeof oldVal != 'undefined') {
                data[i].px = oldVal.x;
                data[i].py = oldVal.y;
            }
        }
    }
    oldObj = object;

*/
    nodes.length = 0;
    nodes.push.apply(nodes, data);





    force.start();


    svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d) { return d.complexity; })
        .style("fill", function(d) { return d.color; })
        .style("stroke", "white")
        .style("stroke-width", "1.5px")
        .call(force.drag);



/*

    var node = svg.selectAll(".node")
        .data(force.nodes({children:data, fileName:"", color:"rgba(51,153,255,0.1)"}))
       // .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });




    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return d.color; })
    ;
*/
/*
    node.append("image")

        .attr("xlink:href", function(d) {
            if(d.fileName == "")
                return "img/bubble_outer.png";
            //    return "";
            else
                return "img/bubble2.png";
        })

     //   .attr("xlink:href", "img/bubble2.png")

        .attr("height", function(d) { return 2 * d.r; })
        .attr("width", function(d) { return 2 * d.r; })
        .attr("x", function(d) { return -1 * d.r; })
        .attr("y", function(d) { return -1 * d.r; })
        // .style("background-color", function(d) { return d.color; })
    ;

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return d.color; })
    ;

*/




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
        //.style("background-color", "#1C6BA0")
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
    newBubble.complexity = Math.sqrt(currFile.complexity);
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
    return "hsla(210, " + dirtLevel + "%, 50%, 0.9)";
}

function getBubbleDirt(smells) {
    return smells / 2;
}