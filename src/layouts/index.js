import React from 'react'
import Header from '../components/header'
import CatalogMenu from '../components/catalog-menu'
import '../styles/main.scss'

class DefaultLayout extends React.Component {
  render () {
    return (
      <div>
        <Header/>
        <CatalogMenu isFront={true}/>
        {this.props.children}
      </div>
    )
  }
}

export default DefaultLayout
