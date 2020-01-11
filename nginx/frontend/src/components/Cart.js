import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class Cart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			total_price: '',
			checkoutUpdate: true,
			cartitems: [],
			updatedQuantity: '',
			updProdInCart: '',
			checkoutInventory: true
		}
		this.updateCart = this.updateCart.bind(this);
		this.passEvent = this.passEvent.bind(this);
		this.updateQuantity = this.updateQuantity.bind(this);

	}


	componentDidMount() {
		fetch('/cartpage', { credentials: 'include' })
			.then(response => response.json())
			.then(data => {
				if (data.message) {
					this.props.history.push('/emptycart');
				}
				else {
					this.setState({ checkoutInventory: data.checkout, total_price: data.total_price, cartitems: data.cartitems });
				}
			})

	}

	updateQuantity(event) {
		const updCartItems = Object.assign([], this.state.cartitems);
		var prodInCart = updCartItems.find(item => item.title === event.target.name);
		const qtyOfProdInCart = prodInCart.quantity;
		if (event.target.value !== qtyOfProdInCart) {
			prodInCart.quantity = event.target.value;
			this.setState({ cartItems: prodInCart, checkoutUpdate: false });
			const updatedObj = {};
			updatedObj[event.target.name] = event.target.value;
			this.setState({ updProdInCart: { ...this.state.updProdInCart, ...updatedObj } });
		}
	}

	updateCart(event) {
		event.preventDefault();
		this.setState({ checkoutUpdate: true });
		var updatedProducts = this.state.updProdInCart;
		fetch('/updatecart', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: (JSON.stringify({
				updatedProducts
			})
			)
		})
			.then(res => res.json())
			.then(data => {
				if (data.message === "empty cart") {
					this.props.history.push('/emptycart');
				}
				else {
					this.setState({ 
						updProdInCart: {},
						total_price: data.total_price, 
						checkoutInventory: data.checkout,
						cartitems: data.cartItems
					});
				}
			})
	}

	passEvent(evt) {
		evt.preventDefault();
		window.location.href = '/checkout'
	}


	render() {

		return (

			<div className="container-main">
				<form>
					<Table className='product-display'>
						<thead>
							<tr>
								<td> Title </td>
								<td> Price </td>
								<td> Quantity </td>
							</tr>
						</thead>
						<tbody>
							{this.state.cartitems.map((item, ind) =>
								<tr>

									<td> {item.title}  </td>
									<td> {item.price} </td>
									<td> <input type="number" name={item.title} key={ind} value={item.quantity} onChange={this.updateQuantity} /> </td>
								</tr>
							)
							}
							<tr>
								<td> <div> Total Price is {this.state.total_price} </div> </td>
								<td> <button type="submit" onClick={this.updateCart}> Update Cart </button> </td>
								{this.state.checkoutInventory && this.state.checkoutUpdate ?
									<td><button type="button" onClick={this.passEvent} id="checkout"> Checkout</button></td>
									:
									<td> </td>
								}
							</tr>
							<tr>
								{this.state.checkoutInventory ?
									<td colspan='3'> </td>
									: <td colspan='3'> Product Out of Inventory </td>
								}
							</tr>
						</tbody>
					</Table>
				</form>
			</div>



		)

	}


}

export default Cart;
