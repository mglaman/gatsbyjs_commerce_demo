import React from "react"
import { Link } from "gatsby"
import logo from '../assets/logo-inverted.svg';

export default ({
    children,
    className,
    isFront = false,
}) => (
        <div className="jumbotron" style={{
            background: '#babad3',
            color: '#fff',
        }}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-3">
                        <Link to={`/`}>
                            <img src={logo} style={{margin: 0}} alt={`Belgrade`}/>
                        </Link>
                    </div>
                    <div className="col-md-9 text-right">
                        <ul className="menu nav menu-catalog">
                            <li className="menu-catalog__item nav-item">
                                <a href="/products/category/apothecary-30" className="menu-catalog__link nav-link">Apothecary</a>
                            </li>
                            <li className="menu-catalog__item nav-item">
                                <a href="/products/category/audio-film-31" className="menu-catalog__link nav-link">Audio &amp; Film</a>
                            </li>
                            <li className="menu-catalog__item nav-item">
                                <a href="/products/category/men-32" className="menu-catalog__link nav-link">Men</a>
                            </li>
                            <li className="menu-catalog__item nav-item">
                                <a href="/products/category/print-shop-33" className="menu-catalog__link nav-link">Print Shop</a>
                            </li>
                            <li className="menu-catalog__item nav-item">
                                <a href="/products/category/urban-living-34" className="menu-catalog__link nav-link">Urban Living</a>
                            </li>
                            <li className="menu-catalog__item nav-item">
                                <a href="/products/category/women-35" className="menu-catalog__link nav-link">Women</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
