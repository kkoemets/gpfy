import unittest

from com.gpfy.scan.dex_guru.dex_guru_scanner import get_cummies_average_price


class TestDexGuruScanner(unittest.TestCase):

    def test_get_cummies_average_price_success(self):
        get_cummies_average_price()


if __name__ == '__main__':
    unittest.main()
