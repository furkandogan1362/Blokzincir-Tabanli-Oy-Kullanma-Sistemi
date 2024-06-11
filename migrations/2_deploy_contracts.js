// seçim kontratını dağıt
var Election = artifacts.require("./Election.sol");

// Truffle'ın deployer nesnesini kullanarak Election sözleşmesini ağa dağıtması
module.exports = function(deployer) {
  // Election kontratını ağa dağıtır.
  deployer.deploy(Election);
};
