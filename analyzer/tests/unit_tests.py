from random import randint
import unittest
import mock
import code_smell
import github_repo
import os
import util

# Test value configs
FIZZ_BUZZ_PROJECT_DIR = "/Users/Ben/Projects/FizzBuzzEnterpriseEdition"

class CodeSmellAnalyzerMockUnitTests(unittest.TestCase):

    # Values do not matter because we're mocking out the call to the pmd
    PMD_DIR = "pmd"
    PROJECT_DIR = "project"

    def setUp(self):
        """Setup"""
        # Create the PMDCodeSmell mock
        self.test_proj_dir = os.path.join(os.getcwd(), FIZZ_BUZZ_PROJECT_DIR)

    def tearDown(self):
        """Teardown."""
        pass

    def test_retrieve_file_and_type(self):
        mock_result = ["/Dir/Name/File.java:9:\tCode Smell Problem"]
        self.pmd = code_smell.PMDCodeSmell()
        self.pmd.call_pmd = mock.Mock(return_value=mock_result)
        self.code_smeller = code_smell.CodeSmellAnalyzer(self.pmd)

        c_smells = self.code_smeller.get_code_smells(self.PMD_DIR, self.PROJECT_DIR)[0]
        self.assertEqual("/Dir/Name/File.java", c_smells.file_name)
        self.assertEqual("Code Smell Problem", c_smells.types[0])

    def test_does_not_retrieve_non_java_files(self):
        mock_result = ["/Dir/Not/Java.something.py\tCodeSmell"]
        self.pmd = code_smell.PMDCodeSmell()
        self.pmd.call_pmd = mock.Mock(return_value=mock_result)
        self.code_smeller = code_smell.CodeSmellAnalyzer(self.pmd)

        c_smells = self.code_smeller.get_code_smells(self.PMD_DIR, self.PROJECT_DIR)
        self.assertEqual(0, len(c_smells), "File has to be specified as .java file")

    def test_invalid_file_format_no_file_numbers(self):
        mock_result = ["/Dir/Java.java\tCodeSmell"]
        self.pmd = code_smell.PMDCodeSmell()
        self.pmd.call_pmd = mock.Mock(return_value=mock_result)
        self.code_smeller = code_smell.CodeSmellAnalyzer(self.pmd)

        c_smells = self.code_smeller.get_code_smells(self.PMD_DIR, self.PROJECT_DIR)
        self.assertEqual(0, len(c_smells), "Invalid file format because it doesn't include the line numbers")

    def test_invalid_no_code_smell(self):
        mock_result = ["/Dir/Name/File/java\t"]

        self.pmd = code_smell.PMDCodeSmell()
        self.pmd.call_pmd = mock.Mock(return_value=mock_result)
        self.code_smeller = code_smell.CodeSmellAnalyzer(self.pmd)

        c_smells = self.code_smeller.get_code_smells(self.PMD_DIR, self.PROJECT_DIR)
        self.assertEqual(0, len(c_smells), "No file type should not produce a code smell")


class GitHubRepoAnalyzerUnitTests(unittest.TestCase):

    def setUp(self):
        """Setup"""
        self.test_proj_dir = os.path.join(os.getcwd(), FIZZ_BUZZ_PROJECT_DIR)
        pass

    def tearDown(self):
        """Teardown."""
        pass

    def test_is_git_repo(self):
        self.assertTrue(github_repo.is_dir_git_repo(self.test_proj_dir))

    def test_is_not_git_repo_but_valid_dir(self):
        self.assertFalse(github_repo.is_dir_git_repo("/"))

    def test_not_valid_dir(self):
        self.assertRaises(OSError, github_repo.is_dir_git_repo, "/Not/Valid/Directory/")

    def test_reduce_sha_count_more_than_enough(self):
        # Create 100 shas
        shas = range(100)
        max_count = 10

        reduced_shas = github_repo.reduce_sha_count(shas, max_count)

class GitHubRepoAnalyzerIntegrationTests(unittest.TestCase):

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

        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJECT_DIR)

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

        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJECT_DIR)

        for not_pr_sha in not_pr_shas:
            if not_pr_sha in shas:
                self.fail(
                    """sha %s is not a pull request sha and should not have
                    been returned""" % not_pr_sha)

        assert shas

    def test_master_is_last_sha(self):
        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJECT_DIR)
        self.assertEqual(shas[-1], "master")


        self.assertEqual(10, len(reduced_shas))

    def test_reduce_sha_count_less_than_max_count(self):
        # Create 9 shas, which is less than what we want
        shas = range(9)
        max_count = 10

        reduced_shas = github_repo.reduce_sha_count(shas, max_count)
        self.assertEqual(9, len(reduced_shas))

    def test_able_to_get_pull_request_shas(self):
        expected_shas = [
            "a7ff0f93fd346814de6fbe9659fc7ab207b7c9ce",
            "32b6a7e19463f21964f09f784031a61cf9cadb70",
            "master"]

        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJECT_DIR)

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

        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJECT_DIR)

        for not_pr_sha in not_pr_shas:
            if not_pr_sha in shas:
                self.fail(
                    """sha %s is not a pull request sha and should not have
                    been returned""" % not_pr_sha)

        assert shas

    def test_master_is_last_sha(self):
        shas = github_repo.get_merge_request_shas(FIZZ_BUZZ_PROJECT_DIR)
        self.assertEqual(shas[-1], "master")

class UtilsUnitTests(unittest.TestCase):

    TEST_FILE_NAME = "test_file.java"

    def setUp(self):
        """Setup"""
        test_dir = os.path.dirname(os.path.abspath(__file__))
        self.test_file_path = os.path.join(test_dir, self.TEST_FILE_NAME)

    def tearDown(self):
        """Teardown."""
        os.remove(self.test_file_path)

    def test_get_num_lines_in_file(self):
        expected_lines = randint(1, 500)

        # Create a test file with an expected number of lines
        with open(self.test_file_path, "w") as f:
            for i in range(expected_lines):
                f.write(str(i) + "\n")

        self.assertEqual(expected_lines, util.get_num_lines_in_file(self.test_file_path))

    def test_strip_full_path(self):
        with open(self.test_file_path, "w") as f:
            os.utime(self.test_file_path, None)
        self.assertEqual("tests/" + self.TEST_FILE_NAME, util.strip_full_file_path(self.test_file_path, "tests"))

    def test_raise_exception_if_no_project(self):
        with open(self.test_file_path, "w") as f:
            os.utime(self.test_file_path, None)
        self.assertRaises(ValueError, util.strip_full_file_path, self.test_file_path, "DoesNotExist")

if __name__ == "__main__":
    unittest.main()
