import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import StyledTable from './styles/Table.js';

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkoutitems: [],
            total_price: ''

        }
    }

    componentDidMount() {
        fetch('checkoutpage', { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    this.props.history.push('/emptycart');
                }
                else {
                    this.setState({ checkoutitems: data.checkoutitems, total_price: data.total_price });
                }
            })

    }

    render() {

        return (

            <div className="container-main">
                <StyledTable>
                    <thead>
                        <tr>
                            <td> Title </td>
                            <td> Price </td>
                            <td> Quantity </td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.checkoutitems.map(product => (
                            <tr>

                                <td> {product.title}  </td>
                                <td> {product.price} </td>
                                <td> {product.quantity} </td>
                            </tr>
                        )
                        )
                        }
                        <tr border='2'>
                            <td colSpan='3'> <Alert variant='success'> Total Price is  {this.state.total_price} </Alert> </td>
                        </tr>
                        <tr>
                            <td colSpan='3'> <a href='/'> Click here to go back to the products page  </a></td>
                        </tr>
                    </tbody>
                </StyledTable>
            </div>
        )
    }
}

export default Checkout;
