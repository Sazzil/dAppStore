module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      //gas: 671239,
      network_id: "*" // Match any network id
    }
  }
};
