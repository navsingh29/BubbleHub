import os
import re

PMD_CLI = "%s/bin/run.sh pmd -d %s -f text -R %s/rulesets/basic.xml -version 1.7 -language java"

class PMDCodeSmell(object):

    PMD_CLI = "%s/bin/run.sh pmd -d %s -f text -R %s/rulesets/basic.xml -version 1.7 -language java"

    def __init__(self):
        pass

    def call_pmd(self, pmd_dir, project_dir):
        pop = os.popen(self.PMD_CLI % (pmd_dir, project_dir, pmd_dir))
        comb = []
        for p in pop:
            comb.append(p)
        return comb

class CodeSmellFile(object):

    def __init__(self, file_name):
        self.file_name = file_name
        self.types = []

    def add_type(self, message_type):
        self.types.append(message_type)

    def num_types(self):
        return len(self.types)

class CodeSmellAnalyzer(object):

    def __init__(self, pmd):
        self.__pmd = pmd

    def get_code_smells(self, pmd_dir, project_dir):
        """
        Get the code smells of the git project

        :param pmd_dir: The directory of the PMD code smell analyzer
        :param project_dir: Directory of project to analyze
        """
        pop = self.__pmd.call_pmd(pmd_dir, project_dir)

        code_smells = dict()
        for pmd_result in pop:
            cs_type = self.__extract_code_smell_type(pmd_result)
            cs_file = self.__extract_file_name(pmd_result)

            if cs_file and cs_type:
                if not code_smells.has_key(cs_file):
                    code_smells[cs_file] = CodeSmellFile(cs_file)
                code_smells.get(cs_file).add_type(cs_type)

        return list(code_smells.itervalues())

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

    def __extract_code_smell_type(self, pmd_result):
        """
        Extracts the message for the code smell from the pmd result

        :param pmd_result: The result from pmd
        """
        return pmd_result.split("\t")[-1].replace("\n", "")
