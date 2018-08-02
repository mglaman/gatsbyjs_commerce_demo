import React, {Component} from "react";
import PropTypes from "prop-types"
import Layout from "../layouts"

const FieldSet = ({ expanded, title }) => (
  <div className="card">
    <div className="card-header" id="headingOne">
      <h5 className="mb-0">{title}</h5>
    </div>

    <div id="collapseOne" className={`collapse ${expanded ? 'show' : ''}`} aria-labelledby="headingOne"
         data-parent="#accordionExample">
      <div className="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3
        wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
        eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
        assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
        nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer
        farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus
        labore sustainable VHS.
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
  render() {
    return (
      <Layout>
        <div className={`container`}>
          <div className={`row`}>
            <div className={`col-md-8`}>
              <div className="accordion" id="accordionExample">
                <FieldSet expanded={this.state.currentStep === 'contact'} title={`Contact information`}/>
                <FieldSet expanded={this.state.currentStep === 'shipping'} title={`Shipping information`}/>
                <FieldSet expanded={this.state.currentStep === 'payment'} title={`Payment information`}/>
              </div>
            </div>
            <div className={`col-md-4`}>
              Sidebar
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default CheckoutPage;