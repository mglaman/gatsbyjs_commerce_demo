import React, { Component } from 'react'
import { Braintree, HostedField } from 'react-braintree-fields'

class HostedFields extends Component {
  constructor (props) {
    super(props);
    [
      'onError',
      'getToken',
      'onCardTypeChange',
      'onAuthorizationSuccess',
    ].forEach(prop => (this[prop] = this[prop].bind(this)))
  }

  onError (error) {
    this.setState({ error })
  }

  getToken () {
    return this.tokenize()
  }

  onCardTypeChange ({ cards }) {
    if (1 === cards.length) {
      const [card] = cards

      this.setState({ card: card.type })

      if (card.code && card.code.name) {
        this.cvvField.setPlaceholder(card.code.name)
      } else {
        this.cvvField.setPlaceholder('CVV')
      }

    } else {
      this.setState({ card: '' })
      this.cvvField.setPlaceholder('CVV')
    }
  }

  state = {
    numberFocused: false,
  }

  componentDidMount () {
    // https://developers.braintreepayments.com/guides/authorization/tokenization-key/javascript/v3
    this.setState({ authorization: 'sandbox_hx3ckycj_hy3tktc463w6g7pw' })
  }

  static renderResult (title, obj) {
    if (!obj) { return null }
    return (
      <div>
        <b>{title}:</b>
        <pre>{JSON.stringify(obj, null, 4)}</pre>
      </div>
    )
  }

  onAuthorizationSuccess () {
    this.numberField.focus()
  }

  render () {
    return (
      <div>
        {HostedFields.renderResult('Error', this.state.error)}
        <Braintree
          authorization={this.state.authorization}
          onAuthorizationSuccess={this.onAuthorizationSuccess}
          onError={this.onError}
          getTokenRef={t => (this.tokenize = t)}
          onCardTypeChange={this.onCardTypeChange}
          styles={{
            input: {
              'font-size': '14px',
              'font-family': 'helvetica, tahoma, calibri, sans-serif',
              color: '#7d6b6b',
            },
            ':focus': {
              color: 'black',
            },
          }}
        >
          <div>
            <div className={`form-group`}>
              <label>Number:</label>
              <HostedField
                type="number"
                onBlur={() => this.setState({ numberFocused: false })}
                onFocus={() => this.setState({ numberFocused: true })}
                className={this.state.numberFocused ? 'focused form-control' : 'form-control'}
                prefill="4111 1111 1111 1111"
                ref={numberField => { this.numberField = numberField }}
              />

            </div>
            <p>Card type: {this.state.card}</p>
            <div className={`row`}>
              <div className={`col`}>
                <div className={`form-group`}>
                  <label>Date:</label>
                  <HostedField
                    type="expirationDate"
                    className={`form-control`}
                  />
                </div>
              </div>
              <div className={`col`}>
                <div className={`form-group`}>
                  <label>CVV:</label>
                  <HostedField type="cvv" placeholder="CVV" className={`form-control`}
                               ref={cvvField => { this.cvvField = cvvField }}/>
                </div>
              </div>
              <div className={`col`}>
                <div className={`form-group`}>
                  <label>Zip:</label>
                  <HostedField type="postalCode" className={`form-control`}/>
                </div>
              </div>
            </div>
          </div>
        </Braintree>
      </div>
    )
  }
}

HostedFields.propTypes = {}
export default HostedFields