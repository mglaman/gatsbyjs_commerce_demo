import PropTypes from 'prop-types'
import React from 'react'

const FieldSet = ({ expanded, title, step, children }) => (
  <div className="card">
    <div className="card-header" id="headingOne">
      <h5 className="mb-0">{title}</h5>
    </div>

    <div id="collapseOne" className={`collapse ${expanded ? 'show' : ''}`} aria-labelledby="headingOne"
         data-parent="#accordionExample">
      <div className="card-body">
        {children}
        <div className={`text-right`}>
          <button className={`btn btn-primary`} type={`submit`}>
            {step !== 'payment' ? `Continue` : `Pay and complete purchase`}
          </button>
        </div>
      </div>
    </div>
  </div>
)
FieldSet.propTypes = {
  expanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  step: PropTypes.string
}
FieldSet.defaultProps = {
  expanded: false,
  step: 'contact',
}

export default FieldSet