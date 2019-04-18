import React,{Component} from 'react';
import {Form,Button,Alert} from 'react-bootstrap';
import { timingSafeEqual } from 'crypto';

class CreateProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productExist:false,
            title:'',
            price:'',
            inventory:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeInventory = this.changeInventory.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changePrice = this.changePrice.bind(this);
    }

    changeTitle(event) {
        event.preventDefault();
        this.setState({title:event.target.value})
    }

    changePrice(event) {
        event.preventDefault();
        this.setState({price:event.target.value});
    }

    changeInventory(event) {
        event.preventDefault();
        this.setState({inventory:event.target.value});
    }



    handleSubmit(event) {
        event.preventDefault();
        fetch('/createcustomproduct',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                title:this.state.title,
                price:this.state.price,
                inventory:this.state.inventory
            })

        })
        .then(response => response.json())
        .then(data => {
            if(data.message) {
                this.setState({productExist:true})
            }
            else {
                this.props.history.push('/');
            }

        })
    }

    render() {

        return (
            <div className='container-main'>
            <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Product Title</Form.Label>
                <Form.Control type="text" onChange={this.changeTitle} />
            </Form.Group>
            <Form.Group>
                <Form.Label> Product Price </Form.Label>
                <Form.Control type='number' onChange={this.changePrice} />
            </Form.Group>
            <Form.Group>
                <Form.Label> Enter Inventory Count</Form.Label>
                <Form.Control type='number' onChange={this.changeInventory} />
            </Form.Group>
            <Button variant="primary" type='submit' onClick={this.handleSubmit}>
                Create Product
            </Button>
            {
                this.state.productExist ? 
                <Alert variant="warning"> Product already exists</Alert>
                : null
            }
            </Form>
            </div>


        )



    }

}

export default CreateProduct;