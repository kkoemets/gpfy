rm crypto-data-1.1.4.tgz
rm -rf lib
npm run build
npm pack
mv -f crypto-data-1.1.4.tgz ../crypto-data-api/crypto-data-1.1.4.tgz
