import os

def get_num_lines_in_file(file_path):
    """
    Gets the number of lines in a file

    :param file_path: THe path to the file
    """
    with open(file_path, 'r') as f:
        for i, l in enumerate(f):
            pass
    return i+1

def get_all_files_of_type(dir_name, file_type):
    """
    Gets all files recursively in a directory that are of a specified file_type

    :param dir_name: The directory containing the files
    :param file_type: The type of files to return
    """
    files_to_return = []
    for root, dirs, files in os.walk(dir_name):
        for f in files:
            # Remove any possible periods before the extensions before comparing
            if os.path.splitext(f)[-1][1:] == file_type.replace(".",""):
                files_to_return.append(os.path.join(root, f))

    return files_to_return

def strip_full_file_path(file_path, project_name):
    """
    Splits a full file path which is an absolute path, to a relative path where
    the project_name is the root of the path

    :file_path: The path of the file to split
    :project_name: The project name
    """
    split = file_path.split(os.sep)
    try:
        index = split.index(project_name)
    except ValueError:
        raise ValueError("Project %s not in file_path" % project_name)

    return os.sep.join(split[index:])

def checkout_sha(sha):
    os.system("git checkout .")
    os.system("git checkout %s" % sha)


