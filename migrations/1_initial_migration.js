// Bu script Migrations.sol kontratını dağıtır

var Migrations = artifacts.require("./Migrations.sol");

// Truffle'ın deployer nesnesini kullanarak sözleşmeyi ağa dağıtması
module.exports = function(deployer) {
  // Migrations sözleşmesini ağa dağıtır.
  deployer.deploy(Migrations);
};
