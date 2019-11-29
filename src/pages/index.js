import React from 'react'
import { Link } from 'gatsby'
import Layout from '../layouts'

class IndexPage extends React.Component {
  render () {
    return (
      <Layout>
        <div className={`container`}>
          <Link to={`/product/802dfe56-8536-4287-a0fa-6bed3fd3a621`}>Drupal Commerce Hoodie</Link>
        </div>
      </Layout>
    )
  }
}

export default IndexPage
