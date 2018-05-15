App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load apps.
    $.getJSON('../apps.json', function(data) {
      var appsRow = $('#appsRow');
      var appTemplate = $('#appTemplate');

      for (i = 0; i < data.length; i ++) {
        appTemplate.find('.panel-title').text(data[i].name);
        appTemplate.find('img').attr('src', data[i].picture);
        appTemplate.find('.app-cat').text(data[i].category);
        appTemplate.find('.app-desc').text(data[i].description);
        appTemplate.find('.btn-buy').attr('data-id', data[i].id);

        appsRow.append(appTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Check the injected web3 instance
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Purchase.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PurchaseArtifact = data;
      App.contracts.Purchase = TruffleContract(PurchaseArtifact);
    
      // Set the provider for our contract
      App.contracts.Purchase.setProvider(App.web3Provider);
    
      return App.markPurchased();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handlePurchase);
  },

  markPurchased: function(buyers, account) {
    var purchaseInstance;

    App.contracts.Purchase.deployed().then(function(instance) {
      purchaseInstance = instance;

      return purchaseInstance.getBuyers.call();
    }).then(function(buyers) {
      for (j = 0; j < buyers.length; j++) {
        if (buyers[j] !== '0x0000000000000000000000000000000000000000') {
          $('.app-panel').eq(j).find('button').text('Purchased').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var appId = parseInt($(event.target).data('id'));

    var purchaseInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Purchase.deployed().then(function(instance) {
        purchaseInstance = instance;

        // Execute purchasing as a transaction by sending account
        return purchaseInstance.buy(appId, {from: account});
      }).then(function(result) {
        return App.markPurchased();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
