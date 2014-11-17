Bubble Hub
==============

UBC CS 410 Project
Github repository analyser

Introduction
==============

Bubble hub is a tool used to analyze Java projects under git source control for their code smells and code complexities, and visualize them over time on a per merged pull request.

The project uses two Java code analysis tools, both are required:
* PLYJ @ https://github.com/musiKk/plyj
* PMD @ http://pmd.sourceforge.net/

The project also requires the latest version of the Safari browser to see the visualizations.

To visualize the results, we use D3.js @ http://d3js.org/.

Current stages of development:
==============
BubbleHub is still under construction. We are currently working on combining the parsed results to be visualized by D3.js

How to run:
==============
BubbleHub requires two libraries to be downloaded: 
* PLYJ (https://github.com/musiKk/plyj)
* PMD @ http://pmd.sourceforge.net/

You will then need to point BubbleHub to these two libraries. You can do this by updating ui/config.json and update the 'plyj_directory' and 'pmd_directory' to point to the root of path of those two libraries.

Make sure the virtualenvironment is activated with the analyzer/requirements.txt.

To run the visualization and UI, one of the following two options are available:
* Updated Safari browser on Mac
* Updated Firefox browser on most forms of Linux

Finally, to run the script once all the above prerequisites are met, simply call the runscript in /BubbleHub:
./runscript.sh [repository url]

To run tests for the analyzer
==============
Change dir to /BubbleHub/Analyzer.

&gt;> nosetests
  ----------------------------------------------------------------------
  Ran 20 tests in 2.645s
  
  OK

To run tests for the visualizor
==============
Open /BubbleHub/ui/tests/tests.html in the Safari or Firefox browser
