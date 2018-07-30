module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
    apiUrl: 'https://commerce2x.ddev.local/'
  },
  plugins: [
      {
          resolve: 'gatsby-source-drupal-fork',
          options: {
              baseUrl: 'https://dev-commerce2x-jsonapi.pantheonsite.io/',
              // baseUrl: 'https://commerce2x.ddev.local/',
              apiBase: 'jsonapi', // endpoint of Drupal server
          },
      },
      {
          resolve: `gatsby-plugin-google-analytics`,
          options: {
              trackingId: ``,
          },
      },
      `gatsby-plugin-offline`,
      `gatsby-plugin-glamor`,
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      {
          resolve: `gatsby-plugin-sass`,
          options: {
              precision: 8,
              includePaths: ['node_modules/bootstrap/scss'],
          },
      },
      {
          resolve: `gatsby-plugin-typography`,
          options: {
              pathToConfigModule: `src/utils/typography.js`,
          },
      },
  ],
}
