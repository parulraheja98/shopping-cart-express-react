import React, { Component } from 'react';


class EmptyCart extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='container-main'>
                Cart is Empty , Add items to Proceed
            </div>
        )
    }
}

export default EmptyCart;