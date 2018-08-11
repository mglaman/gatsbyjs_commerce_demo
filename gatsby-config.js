require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
    apiUrl: process.env.API_URL
  },
  plugins: [
      {
          resolve: 'gatsby-source-drupal-fork',
          options: {
              baseUrl: process.env.API_URL,
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
      // `gatsby-plugin-glamor`,
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      {
          resolve: `gatsby-plugin-sass`,
          options: {
              precision: 8,
              includePaths: ['node_modules/bootstrap/scss'],
          },
      },
  ],
}
