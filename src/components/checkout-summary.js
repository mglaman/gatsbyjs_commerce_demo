import React from 'react'
import PropTypes from 'prop-types';
import Price from './price'

const CheckoutSummary = ({ items, adjustments, totalPrice }) => (
  <div className={`card`}>
    <div className={`card-body p-0`}>
      <ul className={`list-group list-group-flush m-0 p-0`}>
        {items.map(orderItem => (
          <li key={orderItem.uuid} className={`list-group-item`}>
            <div className={`row small`}>
              <div className={`col`}>{orderItem.quantity}x</div>
              <div className={`col-6`}>{orderItem.title}</div>
              <div className={`col-4`}><Price number={orderItem.total_price.number} currencyCode={orderItem.total_price.currency_code} /></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className={`card-footer`}>
      <ul className={`list-unstyled m-0 p-0`}>
        {adjustments.map(adjustment => (
          <li key={adjustment.type} className={`small`}>
            <div className={`row font-weight-normal`}>
              <div className={`col text-right`}>{adjustment.label}:</div>
              <div className={`col-4`}><Price number={adjustment.amount.number} currencyCode={adjustment.amount.currency_code} /></div>
            </div>
          </li>
        ))}
        <li className={`small`}>
          <div className={`row font-weight-bold`}>
            <div className={`col text-right`}>Total:</div>
            <div className={`col-4`}><Price number={totalPrice.number} currencyCode={totalPrice.currency_code} /></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
)
CheckoutSummary.propTypes = {
  items: PropTypes.array,
  adjustments: PropTypes.array,
  totalPrice: PropTypes.shape({
    number: PropTypes.string,
    currency_code: PropTypes.string
  })
}
CheckoutSummary.defaultProps = {
  items: [],
  adjustments: [],
  totalPrice: {
    number: '0.00',
    currency_code: 'USD'
  }
}
export default CheckoutSummary;