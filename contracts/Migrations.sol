pragma solidity >=0.5.0 <0.9.0;

contract Migrations {
  address public owner; // Sözleşmenin sahibinin adresini saklar, herkes erişebilir.
  uint public last_completed_migration; // Son tamamlanan migration (geçiş) kimlik numarasını saklar.

  // Yalnızca sözleşme sahibinin erişebileceği işlevler için modifier
  modifier restricted() {
    if (msg.sender == owner) _; // Eğer çağıran adres sözleşme sahibiyse devam et.
  }

  // Sözleşme oluşturulduğunda çağrılır ve sahibi olarak sözleşmeyi dağıtan adresi ayarlar.
  constructor() public {
    owner = msg.sender; // Sözleşmeyi dağıtan adresi sözleşme sahibi olan owner değişkenine ata.
  }

  // Son tamamlanan migration kimlik numarasını ayarlar. Sadece sözleşme sahibi erişebilir.
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed; // last_completed_migration değişkenini güncelle.
  }

  // Sözleşmeyi yeni bir adrese yükseltir. Sadece sözleşme sahibi erişebilir.
  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address); // Yeni adresle bir Migrations sözleşmesi oluştur.
    upgraded.setCompleted(last_completed_migration); // Yeni sözleşmede son tamamlanan migration kimlik numarasını ayarla.
  }
}
