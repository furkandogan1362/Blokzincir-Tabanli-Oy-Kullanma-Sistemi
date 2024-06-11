KURULUM İŞLEMLERİ

Projenin çalışması için kurulması gereken programlar

• Visual Studio Code (https://code.visualstudio.com/download)

• Node.js / npm (https://nodejs.org/en/download)

• Truffle (https://trufflesuite.com/docs/truffle/how-to/install/)

• Ganache (https://trufflesuite.com/ganache/)

• MetaMask Eklentisi

(https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

Kurulması gereken paketler

• Web3.js: npm i web3

• Solidity : npm i solc

Adım 1:

MetaMask ve Ganache bağlantısını sağlayın. Proje kullanım süreci boyunca Ganache
programını kapatmayın. (İlgili konuya erişmek için tıklayınız.)

Adım 2:

Truffle-config.js dosyasını ganache ile kontrol edin. Ganache-cli (cli kullananlar 8545
portunu almalı) kullanmadığımız için port numarası 7545 olarak ayarlanmalıdır.

Adım 3:

İşlemleri proje terminalinde yaptığınızdan emin olun. Bunun için cd Oy_Kullanma
komutunu terminalde çalıştırınız. Zaten bu konumda iseniz hata çıkabilir bu durumu
umursamayın.

Adım 4:

npm install (ya da npm i) komutunu vs code terminalinde çalıştırarak projenin çalışması için
gerekli olan node.js paketleri yükleyin.

Adım 5:

Projeyi ilk defa çalıştırıyorsanız truffle compile komutunu terminalde çalıştırın. Daha önce
projeyi çalıştırıp kullandıysanız truffle migrate --reset komutunu kullanın. Böylece
sözleşmenin dağıtıldığından emin olun ve Ganache üzerinden kontrol edin.

Adım 6:

npm start komutunu terminale yazarak projeyi çalıştırın.

Artık proje arayüzüne erişim sağlamış olacaksınız. Burada bağladığınız ilk MetaMask hesabı
sizin admin hesabınız olacaktır. Proje localhost:3000 üzerinde başarılı bir şekilde çalıştıktan
sonra Yönetici Paneline erişebilir ve aday ekleyebilirsiniz. Adayları ekledikten sonra “Seçimi
Başlat” düğmesine tıklayın.

Çok önemli not

Farklı kullanıcılar/seçmenler eklemek istiyorsanız, farklı hesapların özel anahtarlarını
Ganache'den MetaMask'a aktarın ve bu hesapları mevcut siteye bağlayın ve oy kullanmak
için farklı bir kullanıcı/seçmen olarak kaydolun.
