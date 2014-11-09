/**
 * Created by gurkaran on 2014-10-26.
 */
var fileName = "UBC/CPSC410/ByteAteBits/BubbleHub/TestClass.java";
var fileName2 = "UBC/CPSC410/ByteAteBits/BubbleHub/TestClass2.java";
var complexity = 50;
var smell = 50;
var inputObject = {fileName:fileName, complexity:complexity, smells:smell};
var bubbleObject = {className:"TestClass", fileName:fileName,complexity:complexity,color:getBubbleColour(smell)};
var bubbleObject2 = {className:"TestClass", fileName:fileName2,complexity:complexity,color:getBubbleColour(smell)};


QUnit.test( "Test Bubble Object Creation", function( assert ) {

    assert.propEqual( bubbleObject, createBubbleObject(inputObject) );
    assert.notPropEqual(bubbleObject2, createBubbleObject(inputObject) );

});

QUnit.test( "Test Comparator Function", function( assert ) {

    assert.equal( comparator(bubbleObject, bubbleObject), 0);
    assert.equal( comparator(bubbleObject2, bubbleObject), -1);
    assert.equal( comparator(bubbleObject, bubbleObject2), 1);
});
