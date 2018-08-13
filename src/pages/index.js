import React from 'react'
import { Link } from 'gatsby'
import { graphql } from 'gatsby'
import Layout from '../layouts'

class IndexPage extends React.Component {
  render () {
    return (
      <Layout>
        <div className={`container`}>
          <Link to={`/product/drupal-commerce-hoodie`}>Drupal Commerce Hoodie</Link>
        </div>
      </Layout>
    )
  }
}

export default IndexPage
export const pageQuery = graphql`
  query {
    topRecipe: allCommerceProductClothing(sort: { fields: [created] }, limit: 1) {
      edges {
        node {
          title
          fields {
            slug
          }
        }
      }
    }
    nextTwoPromotedRecipes: allCommerceProductClothing(
      sort: { fields: [created] }
      limit: 2
      skip: 1
    ) {
      edges {
        node {
          title
          fields {
            slug
          }
          relationships {
            field_brand {
              name
            }
          }
        }
      }
    }
    nextFourPromotedRecipes: allCommerceProductClothing(
      sort: { fields: [created] }
      limit: 4
      skip: 3
    ) {
      edges {
        node {
          title
          fields {
            slug
          }
          relationships {
            field_brand {
              name
            }
          }
        }
      }
    }
  }
`
