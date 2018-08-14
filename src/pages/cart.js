import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../layouts'
import Price from '../components/price'

const getOrderTotal = (items) => (
  items.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.product.price.number * currentValue.quantity)
  }, 0)
)

const CartItemsSummary = ({ cartItems, updateCartItem, removeCartItem }) => (
  <div className={`table-responsive`}>
    <table className={`table`}>
      <thead>
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th style={{
          width: '65px'
        }}>Quantity</th>
        <th className={`text-right`}>Total price</th>
        <th />
      </tr>
      </thead>
      <tbody>
      {cartItems.map(purchasedEntity => (
        <tr key={purchasedEntity.id}>
          <td>{purchasedEntity.product.title}</td>
          <td>
            <Price number={purchasedEntity.product.price.number} currencyCode={purchasedEntity.product.price.currency_code} />
          </td>
          <td>
            <div className={`form-group`}>
              <input
                type={`number`}
                onChange={updateCartItem.bind(this)}
                value={purchasedEntity.quantity}
                data-order-item={purchasedEntity.id}
                min={0}
                className={`form-control`}
              />
            </div>
          </td>
          <td className={`text-right`}>
            <Price number={purchasedEntity.product.price.number * purchasedEntity.quantity} currencyCode={purchasedEntity.product.price.currency_code} />
          </td>
          <td>
            <button type="button" className="close" onClick={removeCartItem.bind(this)} data-order-item={purchasedEntity.id}>
              &times;
            </button>
          </td>
        </tr>
      ))}
      </tbody>
      <tfoot>
      <tr>
        <td/>
        <td/>
        <td/>
        <td colSpan={2} className={`text-right`}>
          Total price:
          <Price number={getOrderTotal(cartItems)} currencyCode={`USD`}
          />
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
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
const mapDispatchToProps = dispatch => {
  return {
    updateCartItem: (event) => dispatch({ type: `UPDATE_CART_ITEM`, event }),
    removeCartItem: (event) => dispatch({ type: `REMOVE_CART_ITEM`, event }),
  }
}
const ConnectedCartItemsSummary = connect(mapStateToProps, mapDispatchToProps)(CartItemsSummary)

const CartPage = () => (
  <Layout>
    <div className={`container`}>
      <h1>Your shopping cart</h1>
      <ConnectedCartItemsSummary/>
      <Link className={`btn btn-primary`} to={`/checkout`}>Go to checkout</Link>
    </div>
  </Layout>
)

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
