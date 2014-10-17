from github_repo import get_merge_request_shas
import os

exec_dir = os.getcwd()
pmd_dir = os.path.join(exec_dir, "pmd")

if len(sys.argv) <= 1:
    print "Must supply dir to java project as first argument"

project_dir = sys.argv[1]

os.chdir(project_dir)
print "Changed to dir: %s" % project_dir

shas = get_merge_request_shas

