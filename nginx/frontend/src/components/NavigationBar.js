import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';

const Link = styled(Nav.Link)`
    margin-left:200px;
`;

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <Navbar bg="dark" variant="dark">
                <Nav className="mr-auto">
                    <Link href="/">Product Page </Link>
                    <Link href="/cart">Cart Page </Link>
                    <Link href="/checkout">Checkout</Link>
                    <Link href='/createproduct'> Create Product </Link>
                </Nav>
            </Navbar>

        )


    }

}

export default NavigationBar;