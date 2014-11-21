Bubble Hub
==============

UBC CS 410 Project
Github repository analyser

Introduction
==============

Bubble hub is a tool used to analyze Java projects under git source control for their code smells and code complexities, and visualize them over time on a per merged pull request.

The project uses the Java code analysis tool PMD:
* PMD @ http://pmd.sourceforge.net/

Download PMD into any location and update the "pmd_dir" value in ui/config.json to the point to the location of the downloaded PMD.

The project also requires the latest version of the Safari browser to see the visualizations.

To visualize the results, we use D3.js @ http://d3js.org/.

Current stages of development:
==============
BubbleHub is currently done for Sprint 2. 

Features implemented:
* Bubbles have a smooth transition from frame to frame
* Added Seek bar to view specific location in commit history
* Added speed bar to set the speed of animations
* Minor UI revamp
* Finalized the code smell calculations.

How to run:
==============
BubbleHub requiresthe   library to be downloaded: 
* PLYJ (https://github.com/musiKk/plyj)

You will then need to point BubbleHub to the PMD tool. You can do this by updating ui/config.json and update the and 'pmd_directory' to point to the root of path of those two libraries.

Make sure the virtualenvironment is activated in the analyzer directory with the analyzer/requirements.txt.

&gt;> pip install -r requirements.txt

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

Sample output
=============
![ScreenShot](https://raw.github.com/nbrar/BubbleHub/master/sample_output.png)





