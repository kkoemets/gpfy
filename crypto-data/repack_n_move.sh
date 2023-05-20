rm crypto-data-1.1.2.tgz
rm -rf lib
npm run build
npm pack
mv -f crypto-data-1.1.2.tgz ../crypto-data-api/crypto-data-1.1.2.tgz
