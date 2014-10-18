import unittest
import code_complexity
import github_repo
import os

# Test value configs
FIZZ_BUZZ_PROJET_DIR = "/Users/Ben/Projects/FizzBuzzEnterpriseEdition"

class CodeComplexityTestCase(unittest.TestCase):

    TEST_FILE_REL_PATH_1 = "src/main/java/com/seriouscompany/business/java/fizzbuzz/packagenamingpackage/impl/stringreturners/IntegerIntegerStringReturner.java"
    TEST_FILE_REL_PATH_2 = "src/main/java/com/seriouscompany/business/java/fizzbuzz/packagenamingpackage/impl/loop/LoopContext.java"

    def setUp(self):
        self.test_file_1 = os.path.join(
            FIZZ_BUZZ_PROJET_DIR,
            self.TEST_FILE_REL_PATH_1)
        self.test_file_2 = os.path.join(
            FIZZ_BUZZ_PROJET_DIR,
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

class GitHubRepoAnalyzer(unittest.TestCase):

    def setUp(self):
        """Setup"""
        pass

    def tearDown(self):
        """Teardown."""
        pass

    def test_able_to_get_pull_request_shas(self):
        expected_shas = [
            "a7ff0f93fd346814de6fbe9659fc7ab207b7c9ce",
            "32b6a7e19463f21964f09f784031a61cf9cadb70",
            "master"]

        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJET_DIR)

        for expected_sha in expected_shas:
            if expected_sha not in shas:
                assert False
                self.fail(
                    """sha %s should be returned in
                    github_repo.get_merge_request_shas""" % expected_sha)

        assert shas

    def test_does_not_return_not_pr_shas(self):
        # Shas that are in project but don't correspond to a PR
        not_pr_shas = [
            "f9c8ae452922e1f9d97ddc7ee46b8de47e1e6976",
            "0d35144c381c837ccd7982a28e78ab83be8a3903",
            "5e14a9cf2e72dbe07fb92bab306321f33a8c4892"]

        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJET_DIR)

        for not_pr_sha in not_pr_shas:
            if not_pr_sha in shas:
                self.fail(
                    """sha %s is not a pull request sha and should not have
                    been returned""" % not_pr_sha)

        assert shas

    def test_master_is_last_sha(self):
        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJET_DIR)
        self.assertEqual(shas[-1], "master")


if __name__ == "__main__":
    unittest.main()
