import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../layouts'

const AllRecipes = ({ data }) => (
  <Layout>
    <div className={`container`}>
      <ul>
        {
        Object.keys(data).map(
            productTypeEdge => data[productTypeEdge].edges.map(({ node }) => {
              console.log(node)
              return <li><Link to={node.fields.slug}>{node.title}</Link></li>;
            })
          )
        }
      </ul>
    </div>
  </Layout>
)

export default AllRecipes

export const query = graphql`
{
  allCommerceProductClothing(limit: 1000) {
    edges {
      node {
        title
        id
        fields {
          slug
        }
      }
    }
  }
  allCommerceProductSimple(limit: 1000) {
    edges {
      node {
        title
        id
        fields {
          slug
        }
      }
    }
  }
}
`
