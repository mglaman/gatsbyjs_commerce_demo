import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../layouts'

const formatPrice = (number, currencyCode) => (
  parseInt(number).toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
  })
)
const getOrderTotal = (items) => (
  items.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.product.price.number * currentValue.quantity)
  }, 0)
)

const CartItemsSummary = ({ cartItems }) => (
  <table className={`table`}>
    <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Quantity</th>
      <th className={`text-right`}>Total price</th>
    </tr>
    </thead>
    <tbody>
    {cartItems.map(purchasedEntity => (
      <tr key={purchasedEntity.id}>
        <td>{purchasedEntity.product.title}</td>
        <td>
          {formatPrice(purchasedEntity.product.price.number, purchasedEntity.product.price.currency_code)}
        </td>
        <td>{purchasedEntity.quantity}</td>
        <td className={`text-right`}>
          {formatPrice(purchasedEntity.product.price.number * purchasedEntity.quantity, purchasedEntity.product.price.currency_code)}
        </td>
      </tr>
    ))}
    </tbody>
    <tfoot>
    <tr>
      <td/>
      <td/>
      <td colSpan={2} className={`text-right`}>
        Total price: {formatPrice(getOrderTotal(cartItems), 'USD')}
      </td>
    </tr>
    </tfoot>
  </table>
)
CartItemsSummary.propTypes = {
  cartItems: PropTypes.array.isRequired,
}
CartItemsSummary.defaultProps = {
  cartItems: [],
}
const mapStateToProps = ({ items }) => {
  return {
    cartItems: items,
  }
}
const ConnectedCartItemsSummary = connect(mapStateToProps, null)(CartItemsSummary)

class CartPage extends Component {
  constructor (props) {
    super(props)
    // @todo use the store.
    const cartData = (typeof localStorage === 'object') ? localStorage.getItem('cartData') : null
    this.state = {
      cartItems: (cartData) ? JSON.parse(cartData) : [],
      debugResponse: '',
    }
  }

  doCheckoutSummary (event) {
    event.preventDefault()
    const request = {
      purchasedEntities: this.state.cartItems,
    }
    const url = `${this.props.data.site.siteMetadata.apiUrl.replace(/\/+$/, '')}/api/checkout/summary?_format=json  `
    console.log(url)
    console.log(request)
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({
          debugResponse: (json),
        })
      })
      .catch((a, b, c, d) => {
        console.log(a)
      })
  }

  render () {
    return (
      <Layout>
        <div className={`container`}>
          <h1>Your shopping cart</h1>
          <ConnectedCartItemsSummary/>
          <button className={`btn btn-primary`} onClick={this.doCheckoutSummary.bind(this)}>Checkout summary</button>
          <Link className={`btn btn-link`} to={`/checkout`}>Go to checkout</Link>
          <div>
            <h3>Debugging order summary</h3>
            <pre>
              <code>{JSON.stringify(this.state.debugResponse, null, 2)}</code>
            </pre>
          </div>
        </div>
      </Layout>
    )
  }
}

export default CartPage

export const query = graphql`
{
  site {
    siteMetadata {
      apiUrl
    }
  }
}
`
