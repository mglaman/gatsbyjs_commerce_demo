const path = require(`path`)

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `commerce_product__clothing`) {
        createNodeField({
            node,
            name: `slug`,
            value: node.path.alias,
        })
    }
    if (node.internal.type === `commerce_product__simple`) {
        createNodeField({
            node,
            name: `slug`,
            value: node.path.alias,
        })
    }
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        const clothingTemplate = path.resolve(`src/templates/product.js`)
        // Query for recipe nodes to use in creating pages.
        resolve(
            graphql(
                `
          {
            allCommerceProductClothing {
              edges {
                node {
                  drupal_internal__product_id
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
            ).then(result => {
                if (result.errors) {
                    reject(result.errors)
                } else {
                  // Create pages for each recipe.
                  result.data.allCommerceProductClothing.edges.forEach(({ node }) => {
                    createPage({
                      path: node.fields.slug,
                      component: clothingTemplate,
                      context: {
                        slug: node.fields.slug,
                      },
                    })
                  })
                }
            })
        )
    })
}
