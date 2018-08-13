import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Layout from '../layouts'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'

import FieldSet from '../components/fieldset'
import Address from '../components/address'
import HostedFields from '../components/hosted-fields'

class CheckoutPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      summary: null,
      promoCode: null,
      currentStep: 'contact',
      shippingAsBilling: true,
      errors: [],
      formValues: {
        billing_same_as_shipping: 'on',
        shipping: {
          // Hidden but no longer picked up due to change to onChange
          countryCode: 'US',
          addressLine2: '',
        },
        billing: {
          // Hidden but no longer picked up due to change to onChange
          countryCode: 'US',
          addressLine2: '',
        },
      },
    }
  }

  doSummaryFetch () {
    const formValues = this.state.formValues
    if (formValues['billing_same_as_shipping'] === 'on') {
      formValues['billing'] = formValues['shipping']
    }

    const url = `${this.props.data.site.siteMetadata.apiUrl.replace(/\/+$/, '')}/api/checkout/summary?_format=json`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchasedEntities: this.props.cartItems,
        ...formValues,
      }),
    }).then(res => res.json())
  }

  doFinalizeCheckout (payment) {
    const formValues = this.state.formValues
    if (formValues['billing_same_as_shipping'] === 'on') {
      formValues['billing'] = formValues['shipping']
    }
    const url = `${this.props.data.site.siteMetadata.apiUrl.replace(/\/+$/, '')}/api/checkout?_format=json`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchasedEntities: this.props.cartItems,
        payment: {
          ...payment,
          gateway: 'braintree',
        },
        ...formValues,
      }),
    }).then(res => res.json())
  }

  onFormChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    const formValues = this.state.formValues
    const parents = name.match(/(.*)\[(.*)\]/)
    if (parents) {
      if (!formValues[parents[1]]) {
        formValues[parents[1]] = {}
      }
      formValues[parents[1]][parents[2]] = value
    } else {
      formValues[name] = value
    }

    if (formValues['billing_same_as_shipping'] === 'on') {
      formValues['billing'] = formValues['shipping']
    }

    this.setState({
      formValues,
    })
  }

  componentDidMount () {
    this.doSummaryFetch()
      .then(summary => this.setState({ summary }))
      .catch((a, b, c, d) => {
        debugger
      })
  }

  getNextStep () {
    switch (this.state.currentStep) {
      case 'contact':
        return 'shipping'
      case 'shipping':
        return 'payment'
      case 'payment':
        return 'complete'
      default:
        return 'contact'
    }
  }

  doPreviousStep (event) {
    event.preventDefault()
    let nextStep = this.state.currentStep
    switch (this.state.currentStep) {
      case 'contact':
        nextStep = 'contact'
        break
      case 'shipping':
        nextStep = 'contact'
        break
      case 'payment':
        nextStep = 'shipping'
        break
      default:
        nextStep = 'contact'
    }
    this.setState({
      currentStep: nextStep,
    })
  }

  doApplyCoupon (event) {
    event.preventDefault()
    this.doSummaryFetch()
      .then(json => {
        console.log(json)
        const errors = []
        if (json.order.coupons.length === 0) {
          errors.push('The promotional code did not apply.')
        }
        this.setState({
          summary: json,
          errors,
        })
      })
      .catch((a, b, c, d) => {
        console.log(a)
      })
  }

  doStepSubmit (event) {
    event.preventDefault()
    this.doSummaryFetch()
      .then(json => {
        if (this.state.currentStep !== 'payment') {
          this.setState({
            summary: json,
            errors: [],
            currentStep: this.getNextStep(),
          })
        }
        else {
          // Check for violations (ie: no payment, other things.)
          if (json.violations.length > 0) {
            this.setState({
              summary: json,
              errors: json.violations.map(violation => violation.message),
            })
          } else {
            this.hostedFields.getToken()
              .then(token => {
                // do the final charge
                this.doFinalizeCheckout(token)
                  .then(json => {
                    debugger
                    // @todo purge cart data, confirm page.
                    alert('Congrats! The order went in')
                    window.location.href = '/'
                  })
                  .catch(error => this.setState({ errors: ['There was an error taking your payment.'] }))
              })
              .catch(error => {
                this.setState({
                  errors: [
                    'The was an error processing your payment',
                  ],
                })
              })
          }
        }
      })
      .catch((a, b, c, d) => {
        console.log(a)
      })
  }

  render () {
    if (!this.state.summary) {
      return null
    }
    return (
      <form className={`container`} onSubmit={this.doStepSubmit.bind(this)} onChange={this.onFormChange.bind(this)}>
        <div className={`row`}>
          <div className={`col-md-8`}>
            {this.state.errors.map(error => (
              <div className={`alert alert-danger`}>
                {error}
              </div>
            ))}
            <div className="accordion mb-3" id="accordionExample">
              <FieldSet expanded={this.state.currentStep === 'contact'} title={`Contact information`}>
                <div className={`form-group`}>
                  <label>Your email</label>
                  <input type={`email`} name={`email`} required={true} placeholder={`me@example.com`}
                         className={`form-control`}/>
                </div>
              </FieldSet>
              <FieldSet expanded={this.state.currentStep === 'shipping'} title={`Shipping information`}>
                <Address elementName={`shipping`}/>
                <div>
                  <h6 className={`text-muted`}>Shipping method</h6>
                  <p>:) @todo: support shipping method selections.</p>
                </div>
              </FieldSet>
              <FieldSet expanded={this.state.currentStep === 'payment'} title={`Payment information`}>
                <HostedFields
                  ref={hostedFields => {this.hostedFields = hostedFields }}
                />
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    name={`billing_same_as_shipping`}
                    defaultChecked={this.state.shippingAsBilling}
                    onChange={(event) => this.setState({ shippingAsBilling: event.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">My billing address is my shipping
                    address</label>
                </div>
                <div className={`billing`} hidden={this.state.shippingAsBilling}>
                  <Address elementName={`billing`}/>
                </div>
              </FieldSet>
            </div>
            <button className={`btn btn-primary`} type={`submit`}>
              {this.state.currentStep !== 'payment' ? `Continue` : `Pay and complete purchase`}
            </button>
            <button className={`btn btn-link`} type={`button`} onClick={this.doPreviousStep.bind(this)}>Go back</button>
          </div>
          <div className={`col-md-4`}>
            <div className={`card`}>
              <div className={`card-body`}>
                <ul className={`list-group list-group-flush m-0 p-0`}>
                  {this.state.summary.order.order_items.map(orderItem => (
                    <li key={orderItem.uuid} className={`list-group-item`}>
                      <small>{orderItem.title}</small>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`card-footer`}>
                <ul className={`list-unstyled m-0 p-0`}>
                  {this.state.summary.adjustments.map(adjustment => (
                    <li key={adjustment.type} className={``}>
                      {adjustment.label}: {adjustment.amount.formatted}
                    </li>
                  ))}
                  <li className={``}>
                    Total: {this.state.summary.order.total_price.formatted}
                  </li>
                </ul>
              </div>
            </div>
            <div className={`mt-3`}>
              <p><strong>Have a promotional code?</strong></p>
              <div className={`form-group`}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Promo code"
                    aria-label="Promotional code"
                    aria-describedby="button-addon2"
                    defaultValue={this.state.promoCode}
                    name={`couponCode`}
                    onChange={(event) => this.setState({ promoCode: event.target.value })}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-primary"
                      type="submit"
                      id="button-addon2"
                      formNoValidate={true}
                      onClick={this.doApplyCoupon.bind(this)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

CheckoutPage.propTypes = {
  data: PropTypes.object.isRequired,
  cartItems: PropTypes.array.isRequired,
}
CheckoutPage.defaultProps = {
  cartItems: [],
}
const mapStateToProps = ({ items }) => {
  return {
    cartItems: items,
  }
}
const ConnectedCheckoutForm = connect(mapStateToProps)(CheckoutPage)

const ExportedCheckoutPage = ({ data }) => (
  <Layout>
    <ConnectedCheckoutForm data={data}/>
  </Layout>
)

export default ExportedCheckoutPage

export const query = graphql`
{
  site {
    siteMetadata {
      apiUrl
    }
  }
}
`
