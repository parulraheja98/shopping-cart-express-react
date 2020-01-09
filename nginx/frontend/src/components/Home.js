import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import '../App.css';

class Home extends Component {

constructor(props) {
    super(props);
    this.state= {
        productsForDisplay:[]
    }
    this.handleAddToCart = this.handleAddToCart.bind(this);
}

handleAddToCart(id) {

    fetch(`/cart/add/${id}`,{credentials:'include'}).then(response => response.json())
    .then(data => {
        window.location.href='/cart';
    })
}

componentDidMount(){ 
    fetch('/productpage')
    .then(response => response.json())
    .then(data => {
        this.setState({productsForDisplay: data});
    })

}

render() {

    return (

        <div className="container-main">
        <Table className='product-display'>
        <thead>
        <tr>
            <td> Title </td>
            <td> Price </td>
            <td> Inventory </td>
            <td> Cart </td>
        </tr>
        </thead>
       <tbody>
           {this.state.productsForDisplay.map( product => 
           <tr>

        <td> {product.title}  </td>
        <td> {product.price} </td>
        <td> {product.inventory_count} </td>
        {product.inventory_count > 0 ? 
       <td> <button onClick={() =>this.handleAddToCart(product._id)}>Add To Cart </button></td> 
     : <td>Product Out of Inventory  </td>
        }
        </tr>
           )
           }
       </tbody>
        
        </Table>
        </div>
    )
}
}

export default Home;
