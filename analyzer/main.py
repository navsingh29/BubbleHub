from github_repo import get_merge_request_shas, is_dir_git_repo
from util import *
from code_smell import CodeSmellAnalyzer, CodeSmellFile
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
pmd_dir = config.pmd_directory

project_name = project_dir.split(os.sep)[-1]

if not is_dir_git_repo(project_dir):
    print "Error: %s is not a git repository" % project_dir
    sys.exit()

os.chdir(project_dir)

shas = get_merge_request_shas(project_dir)
print "Retrieved Pull Request %d shas" % len(shas)

code_smell_analyzer = CodeSmellAnalyzer()

root_json_dict = dict()
commits = []
root_json_dict["commits"] = commits

for sha in shas:
    checkout_sha(sha)
    files = get_all_files_of_type(project_dir, "java")
    local_commit = []
    for f in files:
        f_dict = dict()
        f_dict["fileName"] = strip_full_file_path(f, project_name)
        f_dict["complexity"] = randint(0, 10) * 10
        f_dict["smells"] = randint(0, 10) * 10
        local_commit.append(f_dict)

    commits.append(local_commit)

json_file = os.path.join(cur_dir, "..", "ui", "sample.json")
with open(json_file, "w") as f:
    f.write(json.dumps(root_json_dict, indent=4))
