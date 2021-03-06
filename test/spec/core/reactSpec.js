describe('React Test', function () {

  var storeSpy = jasmine.createSpy('store spy');
  var storesSpy = jasmine.createSpy('stores spy');

  var MyAppStore = DeLorean.Flux.createStore({
    list: [],
    actions: {
      // Remember the `dispatch('addItem')`
      addItem: 'addItemMethod'
    },
    addItemMethod: function (data) {
      this.list.push('ITEM: ' + data.random);

      // You need to say your store is changed.
      this.emit('change');
    },
    getState: function () {
      return {list: this.list};
    }
  });
  var myStore = new MyAppStore();

  var MyAppStore2 = DeLorean.Flux.createStore({
    list: [],
    actions: {
      // Remember the `dispatch('addItem')`
      addItem: 'addItemMethod'
    },
    addItemMethod: function (data) {
      this.list.push('ANOTHER: ' + data.random);

      // You need to say your store is changed.
      this.emit('change');
    },
    getState: function () {
      return {list: this.list};
    }
  });
  var myStore2 = new MyAppStore2();

  var MyAppDispatcher = DeLorean.Flux.createDispatcher({
    addItem: function (data) {
      this.dispatch('addItem', data);
    },

    getStores: function () {
      return {
        myStore: myStore,
        myStore2: myStore2
      };
    }
  });

  var ActionCreator = {
    addItem: function () {
      // We'll going to call dispatcher methods.
      MyAppDispatcher.addItem({random: 'hello world'});
    }
  };

  var el = document.createElement('div');
  el.id = 'test';
  document.body.appendChild(el);

  var ApplicationView = React.createClass({displayName: 'ApplicationView',

    mixins: [DeLorean.Flux.mixins.storeListener],

    storeDidChange: storeSpy,

    render: function () {
      return React.DOM.div(null,
        React.DOM.span(null, 'There are ', this.stores.myStore.store.list.length, ' items.'),
        React.DOM.span(null, 'There are ', this.stores.myStore2.store.list.length, ' items.')
      );
    }

  });

  var mainView = React.renderComponent(ApplicationView({dispatcher: MyAppDispatcher}),
                                      document.getElementById('test'));

  it('should be no item before add', function () {
    expect(el.innerText).toBe('There are 0 items.There are 0 items.');
  });

  it('should have and item after add', function () {
    ActionCreator.addItem();
    ActionCreator.addItem();
    ActionCreator.addItem();
    expect(el.innerText).toBe('There are 3 items.There are 3 items.');
    expect(storeSpy).toHaveBeenCalledWith('myStore');
    expect(storeSpy).toHaveBeenCalledWith('myStore2');
  });

});
