import React from "react"
import CartIcon from "react-icons/lib/fa/shopping-cart"

export default ({
    children,
    className,
}) => (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                {/* <a className="navbar-brand" href="#">Navbar</a> */}
                <button type="button" className="toggle-btn btn btn-link" data-toggle="collapse" data-target="#off-canvas">
                    <div className="toggle-btn--bars">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </div>
                    <span className="toggle-btn--name hidden-xs">Menu</span>
                </button>
                <div className="cart"><CartIcon /> 0 items</div>
            </div>
        </nav>
    );
