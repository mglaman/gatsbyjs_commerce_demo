import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../layouts'

const AllRecipes = ({ data }) => (
  <Layout>
    <h1>Recipes</h1>
    <ul>
      {data.allCommerceProductClothing.edges.map(({ node }) => (
        <li>
          <Link to={node.fields.slug}>{node.title}</Link>
        </li>
      ))}
    </ul>
  </Layout>
)

export default AllRecipes

export const query = graphql`
  query {
    allCommerceProductClothing(limit: 1000) {
      edges {
        node {
          title
          fields {
            slug
          }
        }
      }
    }
  }
`
