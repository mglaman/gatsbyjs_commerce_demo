import React, {Component} from "react";
import Layout from "../layouts"
import {graphql} from 'gatsby'

class CartPage extends Component {
    constructor(props) {
        super(props)
        const cartData = localStorage.getItem('cartData');
        this.state = {
            cartItems: (cartData) ? JSON.parse(cartData) : [],
        }
    }
    doCheckoutSummary(event) {
        event.preventDefault();
        const request = {
            purchasedEntities: this.state.cartItems
        };
        const url = `${this.props.data.site.siteMetadata.apiUrl.replace(/\/+$/, "")}/api/checkout/summary?_format=json  `;
        console.log(url);
        console.log(request);
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
            })
    }
    render() {
        return (
            <Layout>
                <div className={`container`}>
                    <h1>Your shopping cart</h1>
                    <table>
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.cartItems.map(purchasedEntity => (
                            <tr>
                                <td>{ purchasedEntity.title }</td>
                                <td>
                                    {parseInt(purchasedEntity.price.number).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: purchasedEntity.price.currency_code
                                    })}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2}>
                                Total price:
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                    <button className={`btn btn-primary`} onClick={this.doCheckoutSummary.bind(this)}>Checkout summary</button>
                </div>
            </Layout>
        )
    }
}
export default CartPage;

export const query = graphql`
{
  site {
    siteMetadata {
      apiUrl
    }
  }
}
`
