import PropTypes from 'prop-types'
import React from 'react'

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

export default FieldSet;