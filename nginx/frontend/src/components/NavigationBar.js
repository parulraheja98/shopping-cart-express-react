import React,{Component} from 'react';
import {Nav,Navbar} from 'react-bootstrap';
import '../App.css';

class NavigationBar extends Component {

constructor(props) {
    super(props);
    this.state = {};
}

render() {

    return (
        <Navbar bg="dark" variant="dark">
            <Nav className="mr-auto">
            <Nav.Link href="/">Product Page </Nav.Link>
            <Nav.Link href="/cart">Cart Page </Nav.Link>
            <Nav.Link href="/checkout">Checkout</Nav.Link>
            <Nav.Link href='/createproduct'> Create Product </Nav.Link>
            </Nav>
        </Navbar>

    )


}

}

export default NavigationBar;