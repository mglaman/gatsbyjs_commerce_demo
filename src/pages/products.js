import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../layouts"
import Container from "../components/container"

const AllRecipes = ({ data }) => (
    <Layout>
        <Container>
            <h1>Recipes</h1>
            <ul>
                {data.allCommerceProductClothing.edges.map(({ node }) => (
                    <li>
                        <Link to={node.fields.slug}>{node.title}</Link>
                    </li>
                ))}
            </ul>
        </Container>
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
