import React,{Component} from 'react';
import {ListGroup,Table} from 'react-bootstrap';
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

    console.log('debugger final 1');
   console.log(id);
    console.log('debugger final 2');
    var url ='/cart/add/'+id;
    console.log('url check');
    console.log(url);
    console.log('url check 1');
    fetch(url,{credentials:'include'}).then(response => response.json())
    .then(data => {
        console.log('debugger final 100');
        console.log(data);
        console.log('debugger final 101');
        window.location.href='/cart';
    })
}

componentDidMount(){ 
    fetch('/productpage')
    .then(response => response.json())
    .then(data => {
        console.log(data.productsForDisplay[0]._id);
        
        this.setState({productsForDisplay:data.productsForDisplay});
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
