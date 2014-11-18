import subprocess
import os
import re
import util


class PMDCodeSmell(object):

    PMD_CLI = "%s/bin/run.sh pmd -d %s -f text -R %s -version 1.7 -language java"

    def __init__(self):
        pass

    def call_pmd(self, pmd_dir, project_dir):
        with open(os.devnull, "wb") as devnull:
            proc = subprocess.Popen(["%s/bin/run.sh" % pmd_dir, "pmd", "-d", project_dir,
                "-f", "text", "-R", util.get_ruleset_path(), "-version", "1.7",
                "-language", "java"], stdout=subprocess.PIPE, stderr=devnull)
            #call = self.PMD_CLI % (pmd_dir, project_dir, util.get_ruleset_path())
            #<pop = os.popen(call)
            comb = []
            for p in proc.stdout.readline():
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

    CS_DICT = {
        "Avoid using if statements without curly braces" : 3,
        "Avoid using if...else statements without curly braces" : 3,
        "Avoid using for statements without curly braces": 3,
        "Avoid using while statements without curly braces": 5,
        "Avoid modifiers which are implied by the context": 5,
        "Avoid empty if statements": 7,
        "Avoid empty while statements": 7,
        "Avoid empty catch blocks": 7,
        "An empty statement (semicolon) not part of a loop": 7,
        "Avoid long parameter lists.": 7,
        "Avoid really long methods.": 10,
        "Avoid really long classes.": 15,
        }

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
                    code_smells[cs_file] = 100

                code_smells[cs_file] -= self.__get_code_smell_value(cs_type)

        return code_smells

    def __get_code_smell_value(self, cs_type):
        if self.CS_DICT.has_key(cs_type):
            return self.CS_DICT.get(cs_type)

        if "Avoid unused private fields such as" in cs_type:
            return 5
        if "Avoid unused private methods such as" in cs_type:
            return 5
        if "Avoid unused constructor parameters such as" in cs_type:
            return 5
        if "Avoid unused method parameters such as" in cs_type:
            return 5
        if "Avoid unused local variables such as" in cs_type:
            return 5

        with open("not_record_cs_types.txt", "a") as f:
            print "Could not find %s" % cs_type
            f.write("%s" % cs_type)
        return 0

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
