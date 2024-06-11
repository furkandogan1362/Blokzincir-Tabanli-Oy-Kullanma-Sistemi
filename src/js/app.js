App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
    votedForID: 0,
    finishElection: 0,
    mins: 0,

    // web3, istemci tarafı uygulamamızı blok zinciriyle bağlar.
    // Metamask, blok zinciriyle etkileşim kurmak için kullanacağımız bir web3 örneği sağlar.
    // Bu gerçekleşmezse, yerel blok zinciri örneğimiz 'localhost 7545' üzerinden bir varsayılan web3 sağlayıcıyı ayarlayacağız.
    init: function () {
        return App.initWeb3();
    },

    // web3'u başlatır
    initWeb3: async function () {
        // Modern dapp tarayıcıları...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Hesap erişimini talep et
                await window.ethereum.enable();
            } catch (error) {
                // Kullanıcı hesap erişimini reddetti...
                console.error("Kullanıcı hesap erişimini reddetti.")
            }
        }
        // Eski dapp tarayıcıları...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // Enjekte edilmiş bir web3 örneği algılanmazsa, Ganache'yi kontrol et
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        web3.eth.defaultAccount = web3.eth.accounts[0]
        return App.initContract();
    },

    // Akıllı sözleşmemizi başlatır
    initContract: function () {
        $.getJSON("Election.json", function (election) {
            // Sanal bir truffle sözleşmesi, Election.json dosyasından oluşturulur
            App.contracts.Election = TruffleContract(election);
            // Sağlayıcıyı sözleşmeyle etkileşim kurmak için bağlar
            App.contracts.Election.setProvider(App.web3Provider);

            App.listenForEvents();

            return App.render();
        });
    },

    // Sözleşmeden yayımlanan olayları dinler
    listenForEvents: function () {
        App.contracts.Election.deployed().then(function (instance) {
            
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (error, event) {
                console.log("Olay tetiklendi", event)
                
            });
        });
    },




        // render fonksiyonu, sayfadaki tüm içeriği düzenleyecek olan fonksiyondur
    render: function () {
        var electionInstance; // seçim örneği
        var loader = $("#loader"); // yükleyici
        var content = $("#content"); // içerik
        var register = $("#register"); // kayıt

        loader.show(); // yükleyiciyi göster
        content.hide(); // içeriği gizle

        // Hesap verilerini yükle
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Hesabınızın Adresi: " + account); // Hesap adresini görüntüle
            }
        });

        // Seçim sözleşmesini yükle
        App.contracts.Election.deployed().then(function(instance) {
            electionInstance = instance;
            // document.querySelector('.buy-tickets').style.display = 'none';

            // Yöneticiyi kontrol et
            return electionInstance.manager();
        }).then(function (manager) {
            // Eğer kullanıcı yönetici değilse, bilet al butonunu gizle
            if (manager !== App.account){
                document.querySelector('.buy-tickets').style.display = 'none';
            }

            // Aday sayısını al
            return electionInstance.candidatesCount();
        }).then(function(candidatesCount) {
            var candidatesResults = $("#candidatesResults");
            candidatesResults.empty();

            var candidatesSelect = $('#candidatesSelect');
            candidatesSelect.empty();

            // Adayları döngüye al
            for (var i = 1; i <= candidatesCount; i++) {
                electionInstance.candidates(i).then(function(candidate) {
                    var id = candidate[0];
                    var fname = candidate[1];
                    var lname = candidate[2];
                    var idNumber = candidate[3];
                    var voteCount = candidate[4];

                    // Aday sonuçlarını oluştur
                    var candidateTemplate = "<tr><th>" + id + "</th><td>" + fname+ " " + lname + "</td><td>" + idNumber  + "</td><td>" + voteCount + "</td></tr>"
                    candidatesResults.append(candidateTemplate);

                    // Aday oy seçeneğini oluştur
                    var candidateOption = "<option value='" + id + "' >" + fname + " " + lname + "</ option>"
                    candidatesSelect.append(candidateOption);

                    return electionInstance.candidatesCount();
                });
            }
            return electionInstance.voters(App.account);
        }).then( function(hasVoted) {
            // Bir kullanıcının iki kez oy kullanmasına izin verme
            if(hasVoted) {
                $('form').hide();
                $("#index-text").html("Başarıyla giriş yaptınız!"); // Giriş mesajını görüntüle
                $("#new-candidate").html("Yeni aday eklenemez. Seçim süreci çoktan başladı."); // Yeni aday ekleme mesajını görüntüle
                $("#vote-text").html("Adaya oy başarıyla verildi. " + localStorage.getItem("votedForID")); // Oy verilen adayı görüntüle
            }
            loader.hide(); // Yükleyiciyi gizle
            content.show(); // İçeriği göster
            return electionInstance.usersCount();
        }).then(function (usersCount) {
            var voterz = $("#voterz");
            voterz.empty();

            // Kullanıcıları döngüye al
            for (var i = 1; i <= usersCount; i++) {
                electionInstance.users(i).then(function (user) {
                    var firstName = user[0];
                    var lastName = user[1];
                    var idNumber = user[2];
                    var email = user[3];
                    var address = user[5];

                    let voterTemplate = "<tr><td>" + firstName + " " + lastName + "</td><td>" + idNumber + "</td><td>" + email + "</td><td>" + address + "</td></tr>"
                    voterz.append(voterTemplate);
                });
            }

            // Eğer seçim tamamlanmışsa
            if (localStorage.getItem("finishElection") === "1") {
                $('form').hide();
                $("#index-text").html("Şu anda devam eden aktif bir seçim bulunmamaktadır."); // Aktif seçim yok mesajını görüntüle
                $("#vote-text").html("Devam eden aktif oylama yok."); // Aktif oy yok mesajını görüntüle
                    
                document.querySelector('.addCandidateForm').style.display = 'block'; // Aday ekleme formunu göster
                    
                document.querySelector('.vot').style.display = 'none'; // Oy verme butonunu gizle
            } else if (localStorage.getItem("finishElection") === "0") {

            }

        }).catch(function(error) {
            console.warn(error); // Hata mesajını konsola yazdır
        });
    },



    // Oy verme işlemini gerçekleştiren fonksiyon

    castVote:  function () {
        var candidateId = $('#candidatesSelect').val(); // Seçilen adayın kimliğini al
        App.votedForID = candidateId; // Oy verilen adayın kimliğini sakla
        localStorage.setItem("votedForID", candidateId); // Oy verilen adayın kimliğini yerel depolamaya kaydet
        App.contracts.Election.deployed().then(function (instance) {
            return instance.vote(candidateId, {from: App.account}); // Sözleşmedeki vote fonksiyonunu çağırarak oy verme işlemini gerçekleştir
        }).then(function (result) {
            // Oyların güncellenmesini bekleyin
            $("#content").hide();// İçeriği gizle
            $("#loader").show();// Yükleyiciyi göster

            // Sonuçlar sayfasına yönlendir
            location.href='results.html';
        }).catch(function (err) {
            console.error(err);// Hata varsa konsola yazdır
        });
    },

    // Yeni bir kullanıcı eklemeyi sağlayan fonksiyon
    addUser: async function () {
        var firstName = $('#firstName').val(); // İsim bilgisini al
        var lastName = $('#lastName').val();// Soyisim bilgisini al
        var idNumber = $('#idNumber').val();// Kimlik numarasını al
        var email = $('#email').val();// E-posta adresini al
        var password = $('#password').val(); // Şifreyi al
        var app = await App.contracts.Election.deployed();
        await app.addUser(firstName, lastName, idNumber, email, password);// Kullanıcıyı ekle
        $("#content").hide();
        $("#loader").show();
        document.querySelector('.vot').style.display = 'block';// Oy verme butonunu göster
        location.href='vote.html';// Oy verme sayfasına yönlendir

    },

    // Yeni bir aday eklemeyi sağlayan fonksiyon

    addCandidate: async function (){
        var CfirstName = $('#CfirstName').val();
        var ClastName = $('#ClastName').val();
        var CidNumber = $('#CidNumber').val();

        var app = await App.contracts.Election.deployed();
        await app.addCandidate(CfirstName, ClastName, CidNumber);
        $("#content").hide();
        $("#loader").show();

        location.href='admin.html';// Yönetici paneline yönlendir
    },

    // Kullanıcı girişi işlemini gerçekleştiren fonksiyon

    login: async function() {
        var lidNumber = $('#lidNumber').val();
        var lpassword = $('#lpassword').val();

        var app = await App.contracts.Election.deployed();
        var users = await app.users();
        var usersCount = await app.usersCount;

        for (var i = 1; i <= usersCount; i++) {
            electionInstance.users(i).then(function (user) {
                var idNumber = user[2];
                var password = user[4];
            });

            if (lidNumber === idNumber) {
                if(lpassword === password)
                {
                    location.href='results.html';
                }
                else {
                    prompt("Giriş bilgileri hatalı. Lütfen tekrar deneyin");
                }

                break;
            }

        }

    },

    // Seçimi başlatan fonksiyon

    startElection: function () {
        localStorage.setItem("finishElection", "0");// Seçimi başlat
        location.href='index.html'; // Anasayfaya yönlendir
    },
    // Seçimi sonlandıran fonksiyon

    endElection: function () {
        localStorage.setItem("finishElection", "1");// Seçimi sonlandır
        location.href='results.html';// Sonuçlar sayfasına yönlendir
    }

};

$(function () {
    $(window).load(function () {
        App.init();// Uygulamayı başlat
    });
});
