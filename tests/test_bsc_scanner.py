import unittest

from com.gpfy.scan.bsc.bsc_scanner import add_readable_value, run
from get_test_tx import get_test_tx


class TestBscScanner(unittest.TestCase):

    def test_run(self):
        run()

    def test_add_readable_value(self):
        tx = get_test_tx()

        self.assertFalse('readableValue' in tx)

        with_val = add_readable_value(tx)
        self.assertTrue('readableValue' in with_val)
        self.assertEqual(with_val['readableValue'], '1591.279235269793736797')


if __name__ == '__main__':
    unittest.main()
