import config
import unittest
import code_smell
import code_complexity
import github_repo
import os

# Test value configs
FIZZ_BUZZ_PROJECT_DIR = "/Users/Ben/Projects/FizzBuzzEnterpriseEdition"
PMD_DIR_KEY = "pmd_dir"
PLYJ_DIR_KEY = "plyj_dir"

class CodeComplexityIntegrationTests(unittest.TestCase):

    TEST_FILE_REL_PATH_1 = "src/main/java/com/seriouscompany/business/java/fizzbuzz/packagenamingpackage/impl/stringreturners/IntegerIntegerStringReturner.java"
    TEST_FILE_REL_PATH_2 = "src/main/java/com/seriouscompany/business/java/fizzbuzz/packagenamingpackage/impl/loop/LoopContext.java"

    def setUp(self):
        self.test_file_1 = os.path.join(
            FIZZ_BUZZ_PROJECT_DIR,
            self.TEST_FILE_REL_PATH_1)
        self.test_file_2 = os.path.join(
            FIZZ_BUZZ_PROJECT_DIR,
            self.TEST_FILE_REL_PATH_2)

        self.parser = code_complexity.JavaParser()

    def tearDown(self):
        """Teardown."""
        pass

    def test_parse_java_code_method(self):
        java_class = self.parser.parse(self.test_file_1)
        method = java_class.methods[0]

        self.assertEqual(method.method_name, "getIntegerReturnString")
        self.assertEqual(method.return_type, "String")
        self.assertEqual(method.parameters[0].field_type, "int")

    def test_parse_java_fields(self):
        java_class = self.parser.parse(self.test_file_2)
        fields = java_class.fields

        self.assertEqual(fields[0].field_type, "LoopInitializer")
        self.assertEqual(fields[1].field_type, "LoopFinalizer")
        self.assertEqual(fields[2].field_type, "LoopCondition")
        self.assertEqual(fields[3].field_type, "LoopStep")
        self.assertEqual(fields[4].field_type, "int")

class CodeSmellAnalyzerIntegrationTests(unittest.TestCase):

    def setUp(self):
        """Setup"""
        self.code_smeller = code_smell.CodeSmellAnalyzer(code_smell.PMDCodeSmell())
        self.pmd_dir = config.config[PMD_DIR_KEY]
        self.test_proj_dir = os.path.join(os.getcwd(), FIZZ_BUZZ_PROJECT_DIR)

    def tearDown(self):
        """Teardown."""
        pass

    def test_code_smell_files(self):
        code_smells = self.code_smeller.get_code_smells(self.pmd_dir, self.test_proj_dir)
        code_smell_files = list(code_smells.iterkeys())

        # Make sure that the code smell files contains at the correct files
        test_count = 2
        for i in code_smell_files:
            if "interfaces/strategies/IsEvenlyDivisibleStrategy.java" in i:
                test_count -=1
            if "impl/strategies/adapters/FizzBuzzOutputStrategyToFizzBuzzExceptionSafeOutputStrategyAdapter.java" in i:
                test_count -= 1

        self.assertEqual(0, test_count)

#    def test_cs_get_num_types(self):
#        code_smells = self.code_smeller.get_code_smells(self.pmd_dir, self.test_proj_dir)
#
#        for cs in code_smells:
#            print cs.num_types()
#
#        import ipdb; ipdb.set_trace() # BREAKPOINT
#        self.assertEqual(1, code_smells[0].num_types())
#        self.assertEqual(2, code_smells[1].num_types())
#        self.assertEqual(1, code_smells[2].num_types())
#
