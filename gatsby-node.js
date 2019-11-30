const path = require(`path`)

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type.indexOf('commerce_product__') === 0) {
    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias || node.id,
    })
  }
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const productTemplate = path.resolve(`src/templates/product.js`)
    // Query for recipe nodes to use in creating pages.
    resolve(
      graphql(`
      {
        allCommerceProductSimple {
          edges {
            node {
              drupal_id
              drupal_internal__product_id
              fields {
                slug
              }
            }
          }
        }
        allCommerceProductClothing {
          edges {
            node {
              drupal_id
              drupal_internal__product_id
              fields {
                slug
              }
            }
          }
        }
      }

      `).then(result => {
        if (result.errors) {
          reject(result.errors)
        } else {
          Object.keys(result.data).forEach(productTypeEdge => {
            result.data[productTypeEdge].edges.forEach(({ node }) => {
              createPage({
                path: node.fields.slug,
                component: productTemplate,
                context: {
                  slug: node.fields.slug,
                },
              })
            })
          });
        }
      })
    )
  })
}
