import React,{Component} from 'react';
import {ListGroup,Table,Alert} from 'react-bootstrap';
import '../App.css';

class Checkout extends Component {

constructor(props) {
    super(props);
    this.state= {
        checkoutitems:[],
        total_price:''

    }
}

componentDidMount(){ 
    fetch('checkoutpage',{credentials:'include'})
    .then(response => response.json())
    .then(data => {
        if(data.message) {
            console.log('uw test completes here ');
            this.props.history.push('/emptycart');
            
        }
        else 
        {
        console.log('check data 1');
        console.log(data);
        console.log('check data 2');
        this.setState({checkoutitems:data.checkoutitems});
        this.setState({total_price:data.total_price});
        }
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
            <td> Quantity </td>
        </tr>
        </thead>
       <tbody>
           {this.state.checkoutitems.map( product => (
           <tr>

        <td> {product.title}  </td>
        <td> {product.price} </td>
        <td> {product.quantity} </td>
        </tr>
           )
           )
           }
        <tr border='2'>
            <td colspan='3'> <Alert variant='success'> Total Price is  {this.state.total_price} </Alert> </td>
        </tr>
        <tr>
            <td colspan='3'> <a href='/'> Click here to go back to the products page  </a></td>
        </tr>
       </tbody>
        </Table>
        </div>
    )
}
}

export default Checkout;
