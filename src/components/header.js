import React, {Component} from "react"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import {Link} from "gatsby"
import CartIcon from "react-icons/lib/fa/shopping-cart"


const CartBlock = ({itemsCount}) => (<Link to={`/cart`}><CartIcon/> {itemsCount} items</Link>);

CartBlock.propTypes = {
    itemsCount: PropTypes.number.isRequired,
};
CartBlock.defaultProps = {
    itemsCount: 0
};

const mapStateToProps = ({items}) => {
    console.log(items.length);
    return {
        itemsCount: items.length
    }
};

const ConnectedCartBlock = connect(mapStateToProps, null)(CartBlock);


class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <button type="button" className="toggle-btn btn btn-link" data-toggle="collapse"
                            data-target="#off-canvas">
                        <div className="toggle-btn--bars">
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </div>
                        <span className="toggle-btn--name hidden-xs">Menu</span>
                    </button>
                    <div className="cart"><ConnectedCartBlock/></div>
                </div>
            </nav>
        );
    }
}

export default Header;
