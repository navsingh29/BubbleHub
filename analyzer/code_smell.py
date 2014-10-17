import os

PMD_CLI = "%s/bin/run.sh pmd -d %s -f text -R %s/rulesets/basic.xml -version 1.7 -language java"

class CodeSmellAnalyzer(object):

    def __init__(self):
        pass

    def get_code_smells(self, pmd_dir, project_dir):
        """
        Get the code smells of the git project

        :param pmd_dir: The directory of the PMD code smell analyzer
        :param project_dir: Directory of project to analyze
        """
        pop = os.popen(PMD_CLI % (pmd_dir, project_dir, pmd_dir))

        code_smells_files = set()
        for i in pop:
            cs_file = self.__extract_file_name(i)
            if cs_file:
                code_smells_files.add(cs_file)

        return list(code_smells_files)

    def __extract_file_name(self, pmd_result):
        """
        Given a single result from pmd, return the filename of the code smell

        :param pmd_result: The result from pmd
        """
        file_match = re.search("(.+java):\\d+", pmd_result)
        if file_match:
            file_name = file_match.group(1)
        else:
            file_name = None
        return file_name
