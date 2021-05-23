import unittest

from com.gpfy.scan.dex_guru.dex_guru_scanner import write_cummies_price, read_cummies_price, get_cummies_average_price


class TestDexGuruScanner(unittest.TestCase):

    def test_write_cummies_price_success(self):
        write_cummies_price()

    def test_read_cummies_price_success(self):
        read_cummies_price()

    def test_get_cummies_average_price_success(self):
        get_cummies_average_price()


if __name__ == '__main__':
    unittest.main()
