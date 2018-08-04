import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Layout from '../layouts'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'

import usStates from '../utils/us-states.json'

const FieldSet = ({ expanded, title, children }) => (
  <div className="card">
    <div className="card-header" id="headingOne">
      <h5 className="mb-0">{title}</h5>
    </div>

    <div id="collapseOne" className={`collapse ${expanded ? 'show' : ''}`} aria-labelledby="headingOne"
         data-parent="#accordionExample">
      <div className="card-body">
        { children }
      </div>
    </div>
  </div>
)
FieldSet.propTypes = {
  expanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
}
FieldSet.defaultProps = {
  expanded: false,
}



class CheckoutPage extends Component {
  state = {
    summary: null,
    currentStep: 'contact',
    shippingAsBilling: true,
  };
  componentDidMount() {
    const request = {
      purchasedEntities: this.props.cartItems,
    };
    const url = `${this.props.data.site.siteMetadata.apiUrl.replace(/\/+$/, "")}/api/checkout/summary?_format=json  `;
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
      .then(res => res.json())
      .then(summary => this.setState({ summary }))
      .catch((a, b, c, d) => {})

  }
  getNextStep() {
    switch (this.state.currentStep) {
      case 'contact':
        return 'shipping';
      case 'shipping':
        return 'payment';
      case 'payment':
        return 'complete';
      default:
        return 'contact';
    }
  }
  doPreviousStep(event) {
    event.preventDefault();
    let nextStep = this.state.currentStep;
    switch (this.state.currentStep) {
      case 'contact':
        nextStep = 'contact';
        break;
      case 'shipping':
        nextStep = 'contact';
        break;
      case 'payment':
        nextStep = 'shipping';
        break;
      default:
        nextStep = 'contact';
    }
    this.setState({
      currentStep: nextStep,
    });
  }
  serializeArray(form) {
    const formElements = Array.from(form.elements).filter(field => (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button'));
    return formElements.reduce((accumulator, currentValue, currentIndex) => {
      const parents = currentValue.name.match(/(.*)\[(.*)\]/);
      if (parents) {
        if (!accumulator[parents[1]]) {
          accumulator[parents[1]] = {};
        }
        accumulator[parents[1]][parents[2]] = currentValue.value;
      } else {
        accumulator[currentValue.name] = currentValue.value;
      }
      return accumulator;
    }, {});
  }
  doCheckoutSummary(event) {
    event.preventDefault();

    const formValues = this.serializeArray(event.target);
    if (formValues['billing_same_as_shipping'] === 'on') {
      formValues['billing'] = formValues['shipping'];
    }
    const request = {
      purchasedEntities: this.props.cartItems,
      ...formValues
    };
    const url = `${this.props.data.site.siteMetadata.apiUrl.replace(/\/+$/, "")}/api/checkout/summary?_format=json  `;
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
        if (this.state.currentStep !== 'payment') {
          this.setState({
            summary: json,
            currentStep: this.getNextStep(),
          });
        }
        else {
          // Check for violations (ie: no payment, other things.)
        }
      })
      .catch((a, b, c, d) => {
        console.log(a)
      })
  }
  render() {
    if (!this.state.summary) {
      return null;
    }
    return (
      <Layout>
        <form className={`container`} onSubmit={this.doCheckoutSummary.bind(this)}>
          <div className={`row`}>
            <div className={`col-md-8`}>
              <div className="accordion mb-3" id="accordionExample">
                <FieldSet expanded={this.state.currentStep === 'contact'} title={`Contact information`}>
                  <div className={`form-group`}>
                    <label>Your email</label>
                    <input type={`email`} name={`email`} required={true} placeholder={`me@example.com`} className={`form-control`}/>
                  </div>
                </FieldSet>
                <FieldSet expanded={this.state.currentStep === 'shipping'} title={`Shipping information`}>
                  <div className="form-group">
                    <label htmlFor="inputAddress">Address</label>
                    <input type="text" name={`shipping[addressLine1]`} className="form-control" id="inputAddress" placeholder="1234 Main St" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAddress2">Address 2</label>
                    <input type="text" name={`shipping[addressLine2]`} className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputCity">City</label>
                      <input type="text" name={`shipping[locality]`} className="form-control" id="inputCity" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputState">State</label>
                      <select id="inputState" name={`shipping[administrativeArea]`} className="form-control" defaultValue={`_na`}>
                        <option value={`_na`}>Choose...</option>
                        {usStates.map(state => (
                          <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputZip">Zip</label>
                      <input type="text" name={`shipping[postalCode]`} className="form-control" id="inputZip" />
                    </div>
                  </div>
                  <input type={`hidden`} value={`US`} name={`shipping[countryCode]`}/>
                  <div>
                    <h6 className={`text-muted`}>Shipping method</h6>
                    <p>:) @todo: support shipping method selections.</p>
                  </div>
                </FieldSet>
                <FieldSet expanded={this.state.currentStep === 'payment'} title={`Payment information`}>
                  <div>
                    Insert Braintree here
                  </div>
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                      name={`billing_same_as_shipping`}
                      defaultChecked={this.state.shippingAsBilling}
                      onChange={(event) => this.setState({shippingAsBilling: event.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">My billing address is my shipping address</label>
                  </div>
                  <div className={`billing`} hidden={this.state.shippingAsBilling}>
                    <div className="form-group">
                      <label htmlFor="inputAddress">Address</label>
                      <input type="text" name={`billing[addressLine1]`} className="form-control" id="inputAddress" placeholder="1234 Main St" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputAddress2">Address 2</label>
                      <input type="text" name={`billing[addressLine2]`} className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="inputCity">City</label>
                        <input type="text" name={`billing[locality]`} className="form-control" id="inputCity" />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="inputState">State</label>
                        <select id="inputState" name={`billing[administrativeArea]`} className="form-control" defaultValue={`_na`}>
                          <option value={`_na`}>Choose...</option>
                          {usStates.map(state => (
                            <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-2">
                        <label htmlFor="inputZip">Zip</label>
                        <input type="text" name={`billing[postalCode]`} className="form-control" id="inputZip" />
                      </div>
                    </div>
                    <input type={`hidden`} value={`US`} name={`billing[countryCode]`}/>
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
                      <li className={`list-group-item`}>
                        {orderItem.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`card-footer`}>
                  Total: {this.state.summary.order.total_price.formatted}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    )
  }
}
CheckoutPage.propTypes = {
  cartItems: PropTypes.array.isRequired
};
CheckoutPage.defaultProps = {
  cartItems: []
};
const mapStateToProps = ({items}) => {
  return {
    cartItems: items,
  }
}
export default connect(mapStateToProps, null)(CheckoutPage);

export const query = graphql`
{
  site {
    siteMetadata {
      apiUrl
    }
  }
}
`
