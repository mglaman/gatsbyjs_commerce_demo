import React from 'react'
import PropTypes from 'prop-types'

const Price = ({ number, currencyCode, locale, className, as }) => {
  const AsTag = `${as}`
  return (
    <AsTag className={className}>
      {parseInt(number).toLocaleString(locale, {
        style: 'currency',
        currency: currencyCode,
      })}
    </AsTag>
  )
}
Price.propTypes = {
  number: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  locale: PropTypes.string,
  className: PropTypes.string,
  as: PropTypes.string,
}
Price.defaultProps = {
  locale: 'en-US',
  className: '',
  as: 'span'
}
export default Price