import React, { Component } from 'react';
import {Switch,Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import './App.css';
import Home from './components/Home.js';
import Cart from './components/Cart.js';
import Checkout from './components/Checkout.js';
import NavigationBar from './components/NavigationBar';
import EmptyCart from './components/EmptyCart.js';
import CreateProduct from './components/CreateProduct.js';


class App extends Component {
  render() {
    return(
      <BrowserRouter>
      <div>
        <NavigationBar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/cart' component={Cart} />
          <Route exact path='/checkout' component={Checkout} />
          <Route exact path='/emptycart' component={EmptyCart} />
          <Route exact path='/createproduct' component={CreateProduct} />
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
