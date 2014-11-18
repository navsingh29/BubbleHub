from github_repo import get_merge_request_shas, is_dir_git_repo, reduce_sha_count
from util import *
from code_smell import CodeSmellAnalyzer, CodeSmellFile, PMDCodeSmell
from code_complexity import CodeComplexityAnalyzer, JavaParser
from random import randint
import config
import json
import argparse
import os
import sys


parser = argparse.ArgumentParser(description="Bubble hub.")
parser.add_argument("--project", required=True,
                    help="Directory of java project to analyze. Project should be in git")

args = parser.parse_args()

# Get the directories we're interested in
cur_dir = os.getcwd()
project_dir = args.project
pmd_dir = config.config["pmd_dir"]
json_file = config.config["input_json"]

# Check to see if valid directories
if not os.path.isdir(project_dir):
    pass

if not os.path.isdir(pmd_dir):
    pass

project_name = project_dir.split(os.sep)[-1]

if not is_dir_git_repo(project_dir):
    print "Error: %s is not a git repository" % project_dir
    sys.exit()

os.chdir(project_dir)

shas = get_merge_request_shas(project_dir)
#print "Retrieved Pull Request %d shas" % len(shas)

# Get the Code smell analyzer objcet
pmd_cs = PMDCodeSmell()
code_smell_analyzer = CodeSmellAnalyzer(pmd_cs)

# Get the CodeComplexity Analyzer object
code_complexity = CodeComplexityAnalyzer()

root_json_dict = dict()
commits = []
root_json_dict["commits"] = commits

#shas = ["master"]
#shas = reduce_sha_count(shas, 50)


for i, sha in enumerate(shas):
    print "Sha %d/%d" %(i, len(shas))
    checkout_sha(sha)
    files = get_all_files_of_type(project_dir, "java")

    code_smells_dict = code_smell_analyzer.get_code_smells(pmd_dir, project_dir)

    local_commit = []
    #print "Parsing %d files" % len(files)
    count = 0
    for f in files:
        try:
            java_parser = JavaParser()
            saved_stdout = sys.stdout
            sys.stdout = open("trash", "w")
            java_class = java_parser.parse(f)
            sys.stdout = saved_stdout

            if java_class:
                f_dict = dict()
                f_dict["fileName"] = strip_full_file_path(f, project_name)
                cs_val = code_smells_dict.get(f)
                if not cs_val:
                    cs_val = 100
                if cs_val <= 0:
                    cs_val = 0

                f_dict["smells"] = cs_val
                saved_stdout = sys.stdout
                sys.stdout = open("trash", "w")
                complexity = code_complexity.calculate_complexity(java_class)
                sys.stdout = saved_stdout

                f_dict["complexity"] = complexity
                local_commit.append(f_dict)
                count += 1
        except Exception as e:
            print "ERROR in %s" % f
    #print "Parsed %d files" % count
    commits.append(local_commit)

json_file = os.path.join(cur_dir, "..", "ui", json_file)
with open(json_file, "w") as f:
    f.write(json.dumps(root_json_dict, indent=4))
