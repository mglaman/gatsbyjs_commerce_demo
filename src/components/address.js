import React from 'react'
import PropTypes from 'prop-types'
import usStates from '../utils/us-states.json'

const Address = ({ elementName }) => (
  <div>
    <div className="form-group">
      <label htmlFor="inputAddress">Address</label>
      <input type="text" name={`${elementName}[addressLine1]`} className="form-control" id={`${elementName}Address1`}
             placeholder="1234 Main St"/>
    </div>
    <div className="form-group">
      <label htmlFor="inputAddress2">Address 2</label>
      <input type="text" name={`${elementName}[addressLine2]`} className="form-control" id={`${elementName}Address2`}
             placeholder="Apartment, studio, or floor"/>
    </div>
    <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="inputCity">City</label>
        <input type="text" name={`${elementName}[locality]`} className="form-control" id={`${elementName}Locality`}/>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="inputState">State</label>
        <select id="inputState" name={`${elementName}[administrativeArea]`} className="form-control"
                defaultValue={`_na`}>
          <option value={`_na`}>Choose...</option>
          {usStates.map(state => (
            <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group col-md-2">
        <label htmlFor="inputZip">Zip</label>
        <input type="text" name={`${elementName}[postalCode]`} className="form-control"
               id={`${elementName}PostalCode`}/>
      </div>
    </div>
    <input type={`hidden`} value={`US`} name={`${elementName}[countryCode]`}/>
  </div>
)
Address.propTypes = {
  elementName: PropTypes.string.isRequired,
}
export default Address