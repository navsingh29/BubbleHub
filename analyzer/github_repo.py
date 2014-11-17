import subprocess
import json
import os
import re
import sys

def is_dir_git_repo(project_dir):
    """
    Checks if the dir is a git repository
    """
    cur_dir = os.getcwd()
    os.chdir(project_dir)

    pop = os.popen("git rev-parse --is-inside-work-tree")
    is_git_dir = False

    for i in pop:
        if "true" in i:
            is_git_dir = True
            break
        break

    os.chdir(cur_dir)
    return is_git_dir

def get_merge_request_shas(git_repo_dir):
    """
    Get the shas of only the Merged pull requests
    """
    cur_dir = os.getcwd()
    os.chdir(git_repo_dir)

    #os.system("git checkout master")
    with open(os.devnull) as devnull:
        subprocess.call(["git", "checkout", "master"], stdout=devnull, stderr=subprocess.STDOUT)
    sha_file = os.popen("git log")

    merge_request_shas = []
    shas_str = []

    for sha in sha_file:
        if not sha.isspace():
            shas_str.append(sha)
    index = 0

    merge_request_shas.append("master")
    while index < len(shas_str):
        line = shas_str[index]
        if line.startswith("commit"):
            sha_id = line.split()[-1]
            t_index = index + 1
            while t_index < len(shas_str) and not shas_str[t_index].startswith("commit"):
                if "Merge pull request" in shas_str[t_index]:
                    merge_request_shas.append(sha_id)
                    break
                t_index += 1
        index += 1

    # Rerverse it so the commits are ascending in time
    merge_request_shas.reverse()

    os.chdir(cur_dir)
    return merge_request_shas

def reduce_sha_count(shas, max_count):
    """
    Reduces the number of shas
    """
    chunk_size = len(shas) / max_count
    index = chunk_size
    if chunk_size != 0:
        temp = []
        temp.append(shas[0])
        index = chunk_size
        for i in range(max_count-2):
            temp.append(shas[index])
            index += chunk_size
        temp.append(shas[-1])
        return temp
    else:
        return shas
