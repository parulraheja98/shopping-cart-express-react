import React,{Component} from 'react';
import {Form,Button} from 'react-bootstrap';

class Payment extends Component {

constructor(props) {
    super(props);
    this.state = {token:'',email:''};
    this.handleEmail = this.handleEmail.bind(this);
    this.handleToken = this.handleToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

handleEmail(event) {
    event.preventDefault();
    this.setState({email:event.target.value});
}

handleToken(event) {
    event.preventDefault();
    this.setState({token:event.target.value});
}

handleSubmit(event) {
    event.preventDefault();
    fetch('/charge' , {
        method:'POST',
        'Content-Type':'application/json',
        body:JSON.stringify({
            stripeEmail:this.state.email,
            stripeToken:this.state.token
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('checking data 1');
        console.log(data);
        console.log('checking data 2');
    }) 
}

render() {
    
    return (
        <Form>
            <Form.Group controlId='email'>
                <Form.Control type='email' placeholder='Enter Stripe Email' onChange={this.handleEmail} />
            </Form.Group>
            <Form.Group controlId='token'>
                <Form.Control type='text' placeholder='Enter Stripe Token' onChange={this.handleToken} />
            </Form.Group>
            <Button variant='primary' type='submit'>
            Make Payment
            </Button>
        </Form>

    )
}
}

export default Payment;