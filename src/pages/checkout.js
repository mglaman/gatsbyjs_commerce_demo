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
    currentStep: 'contact'
  };
  doNextStep() {
    let nextStep = this.state.currentStep;
    switch (this.state.currentStep) {
      case 'contact':
        nextStep = 'shipping';
        break;
      case 'shipping':
        nextStep = 'payment';
        break;
      case 'payment':
        nextStep = 'complete';
        break;
      default:
        nextStep = 'contact';
    }
    this.setState({
      currentStep: nextStep,
    });
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
    const request = {
      purchasedEntities: this.props.cartItems,
      ...this.serializeArray(event.target)
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
        if (this.state.currentStep !== 'payment') {
          this.doNextStep();
        }
        else {
          // Check for violations (ie: no payment, other things.)
          console.log(json);
        }
      })
      .catch((a, b, c, d) => {
        console.log(a)
      })
  }
  render() {
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
                  <div>
                    <h6 className={`text-muted`}>Shipping method</h6>
                  </div>
                </FieldSet>
                <FieldSet expanded={this.state.currentStep === 'payment'} title={`Payment information`}>
                  <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" name={`billing_same_as_shipping`} defaultChecked={true}/>
                    <label className="form-check-label" htmlFor="exampleCheck1">My billing address is my shipping address</label>
                  </div>
                </FieldSet>
              </div>
              <button className={`btn btn-primary`} type={`submit`}>
                {this.state.currentStep !== 'payment' ? `Continue` : `Pay and complete purchase`}
              </button>
              <button className={`btn btn-link`} type={`button`} onClick={this.doPreviousStep.bind(this)}>Go back</button>
            </div>
            <div className={`col-md-4`}>
              Sidebar
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
