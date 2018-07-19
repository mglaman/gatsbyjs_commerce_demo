import React, {Component} from "react";
import Layout from "../layouts"
import {graphql} from 'gatsby'
import Img from "gatsby-image"
import _ from "lodash";

class RecipeTemplate extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        const {data} = this.props;
        const variations = data.commerceProductClothing.relationships.variations;
        const attributes = {};
        // @todo It'd be great to preprocess the attribute matrix.
        _.each(variations, (variation) => {
            _.each(variation.relationships, (relationship, relationshipKey) => {
                if (_.includes(relationshipKey, 'attribute_')) {
                    if (!attributes.hasOwnProperty(relationshipKey)) {
                        attributes[relationshipKey] = [];
                    }
                    if (!_.some(attributes[relationshipKey], relationship)) {
                        attributes[relationshipKey].push(relationship);
                    }
                }
            })
        });
        _.each(attributes, (attribute) => _.sortBy(attribute, ['weight', 'name']));
        // end refactor note

        this.state = {
            // @todo this should be an array, and its first value's ID.
            defaultVariation: variations[0],
            currentPrice: variations[0].price,
            selectedAttributes: {
                attribute_color: variations[0].relationships.attribute_color.attribute_value_id,
                attribute_size: variations[0].relationships.attribute_size.attribute_value_id,
            },
            variations,
            attributes
        };
    }
    onChange(event) {
        const attribute_name = event.target.name;
        this.setState({
            selectedAttributes: {
                ...this.state.selectedAttributes,
                [attribute_name]: parseInt(event.target.value),
            }
        })
    }
    render() {
        const {data} = this.props;
        const images = this.state.defaultVariation.relationships.field_images;
        return (
            <Layout>
                <div className={`container`}>
                    <div className={`row`}>
                        <div className={`col-md-6`}>
                            <Img fluid={images[0].localFile.childImageSharp.fluid} />
                            <div className={`row mb-2 mt-2`}>
                                {images.map(image => (
                                    <div key={image.id} className={`col mr-3 ml-3`}>
                                        <Img fluid={image.localFile.childImageSharp.fluid} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`col-md-6`}>
                            <h1 className={`font-weight-light`}>{data.commerceProductClothing.title}</h1>
                            <p className={`font-weight-bold h4`}>
                                {parseInt(this.state.currentPrice.number).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: this.state.currentPrice.currency_code
                                })}
                            </p>
                            sku
                            <p className={`text-uppercase`}>
                                <small>{data.commerceProductClothing.relationships.field_brand.name}</small>
                            </p>
                            <p dangerouslySetInnerHTML={{__html: data.commerceProductClothing.body.processed}}/>
                            <form>
                                <div className={`form-group`}>
                                    <div className={`font-weight-bold`}>Color</div>
                                    <div className={`attributes-color-swatches`}>
                                        {this.state.attributes.attribute_color.map(attribute => (
                                            <div key={attribute.id} className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input sr-only"
                                                    type="radio"
                                                    name="attribute_color"
                                                    id={`attributeColor_value${attribute.attribute_value_id}`}
                                                    value={attribute.attribute_value_id}
                                                    onChange={this.onChange}
                                                    checked={this.state.selectedAttributes.attribute_color === attribute.attribute_value_id}
                                                />
                                                <label className="form-check-label" htmlFor={`attributeColor_value${attribute.attribute_value_id}`}>
                                                    <div className="swatch--square" style={{
                                                        background: attribute.field_color.color,
                                                        width: '30px',
                                                        height: '30px'
                                                    }}/>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`form-group`}>
                                    <label htmlFor={`attributeSize`} className={`font-weight-bold`}>Size</label>
                                    <select
                                        className={`form-control`}
                                        id={`attributeSize`}
                                        onChange={this.onChange}
                                        name={`attribute_size`}
                                        value={this.state.selectedAttributes.attribute_size}
                                    >
                                        {this.state.attributes.attribute_size.map(attribute => (
                                            <option key={attribute.id} value={attribute.attribute_value_id}>{attribute.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className={`btn btn-success mt-3`}>Add to cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default RecipeTemplate

export const query = graphql`
query ($slug: String!) {
  commerceProductClothing(fields: {slug: {eq: $slug}}) {
    id
    title
    body {
      processed
    }
    relationships {
      field_product_categories {
        name
      }
      field_brand {
        name
      }
      variations {
        id
        title
        sku
        price {
          number
          currency_code
        }
        relationships {
          attribute_size {
            id
            attribute_value_id
            name
            weight
          }
          attribute_color {
            id
            attribute_value_id
            name
            weight
            field_color {
              color
              opacity
            }
          }
          field_images {
            id
            localFile {
              id
              absolutePath
              childImageSharp {
                fluid(maxWidth: 555, maxHeight: 570) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            filename,
          }
        }
      }
    }
  }
}
`
