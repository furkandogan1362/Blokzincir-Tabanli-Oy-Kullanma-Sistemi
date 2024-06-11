pragma solidity >=0.5.0 <0.9.0;

contract Election{

    // Sözleşme yöneticisinin adresi
    address public manager;

    // Aday bilgilerini saklamak için yapı (struct)
    struct Candidate {
        uint id;
        string CfirstName;
        string ClastName;
        string CidNumber;
        uint voteCount;
    }

    //oy kullanan adreslerin kontrolü için 
    mapping (address => bool) public voters;

    // adayları saklama
    mapping (uint => Candidate) public candidates;

    // Toplam aday sayısı
    uint public candidatesCount;

    // Oy verme 
    event votedEvent (
        uint indexed_candidateId
    );

    // Sözleşme oluşturulduğunda yönetici olarak dağıtan adresi ayarla
    constructor () public  {
        manager = msg.sender;
    }

    // Yeni aday eklemek için fonksiyon, sadece yönetici erişebilir
    function addCandidate (string memory _CfirstName, string memory _ClastName, string memory _CidNumber) public onlyAdmin{
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _CfirstName, _ClastName, _CidNumber, 0);   
    }

    // Yalnızca yöneticinin erişebileceği fonksiyonları sınırlandıran modifier
    modifier onlyAdmin () {
        require(msg.sender == manager);
        _;
    }

    // Oy verme fonksiyonu
    function vote (uint _candidateId) public {
        
        // Daha önce oy kullanmamış olmalı
        require(!voters[msg.sender]);

        // Geçerli bir aday ID'si olmalı
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // Oy kullandığını işaretle
        voters[msg.sender] = true;

        // Adayın oy sayısını artır
        candidates[_candidateId].voteCount ++;

        // Olayı tetiklenince oy kullananı kaydeet
        emit votedEvent(_candidateId);
    }

    // Kullanıcı bilgilerini saklamak için yapı (struct)
    struct User {
        string firstName;
        string lastName;
        string idNumber;
        string email;
        string password;
        address add;
    }

    // Kullanıcıları saklamak için 
    mapping (uint => User) public users;

    // Toplam kullanıcı sayısı
    uint public usersCount;

    // Yeni kullanıcı eklemek için fonksiyon
    function addUser (string memory _firstName, string memory _lastName, string memory _idNumber, string memory _email, string memory _password) public{
        usersCount++;
        users[usersCount] = User(_firstName, _lastName, _idNumber, _email, _password, msg.sender);
    }
}
