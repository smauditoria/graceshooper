import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: '/',
      categoryId: 0,
      selectedProduct: {},
      term: '',
      filter: false
    }

    this.productWork = this.productWork.bind(this);
  }

  productWork(imgBefore, priceBefore) {
    // accounting for varied image inputs:
    let imgAfter;
    if (imgBefore.slice(0, 7) === 'http://') {
      imgAfter = imgBefore;
    } else {
      imgAfter = `../../assets/images/${ imgBefore }`;
    }
    // formating the price:
    const priceAfter = '$' + priceBefore.toString();
    return [imgAfter, priceAfter];
  }

  componentWillReceiveProps(nextProps) {
    /*********************************************/
    // get nextProps variables
    const pathnameLast = this.state.pathname;
    const pathname = nextProps.router.location.pathname;
    const categoryId = (nextProps.router.match.params.id) ? nextProps.router.match.params.id * 1 : 0;
    const term = (nextProps.router.match.params.term) ? nextProps.router.match.params.term : '';
    const products = nextProps.products;
    /*********************************************/
    // checking to see if someone clicked a link and changed the url
    /*********************************************/
    // did someone click a specific product? ...yes?: get that instance:
    const productId = (nextProps.router.location.search) ? nextProps.router.location.search.slice(9) * 1 : 0;
    let selectedProduct = {};
    if (productId) {
      const selectedProductArr = products.filter(product => {
        return productId === product.id;
      })
      selectedProduct = selectedProductArr[0];
    }
    /*********************************************/
    // update state......
    if (pathname !== pathnameLast) this.setState({ pathname, categoryId, term, selectedProduct, filter: true });
    /*********************************************/
  }

  render() {
    /*********************************************/
    // setup local variables
    let products = this.props.products;
    const categories = this.props.categories;
    const filter = this.state.filter;
    const categoryId = this.state.categoryId;
    const selectedProduct = this.state.selectedProduct;
    const term = this.state.term;
    /*********************************************/
    //if ( !categories.length && !products.length) return <div></div>

    console.log('********** HOME - this.props: ', this.props, '........>state: ', this.state)

    /*********************************************/
    // filter the Products List? - Main Section
    // are we filtering by category?
    if (filter && categoryId) {
       products = products.filter(product => {
        let acceptProd = false;
        product.categories.forEach(category => {
          if (categoryId === category.id) acceptProd = true;
        })
        return acceptProd;
      })
    }
    // now check if we are filtering by search term.
    if (filter && term && products.length) {
      products = products.filter(product => {
        let searchUpper = term.slice(0, 1).toUpperCase() + term.slice(1).toLowerCase();
        let searchLower = term.toLowerCase();
        let title = product.title;
        return title.includes(searchLower) || title.includes(searchUpper);
      })
    }
    /*********************************************/
    // create the Categories List - Sidebar
    const renderCategories = categories.map(category => {
        return (<Link to={ `/category/${ category.id }` } key={ category.id }><div
          className="col-sm-12">
          <h6>{ category.name }</h6></div></Link>)
      })
    /*********************************************/
    // create the Products List &/or the Selected Product- Main Section
    /*********************************************/
    // if there is a selected Product, then render for the one product
    let renderProducts = <div>one product</div>
    if (selectedProduct.title) {
    } else {
      renderProducts = products.map(product => {
        if (product.inventory) {
          /*************************************/
          // // accounting for varied image inputs & price formatting:
          const formatResult = this.productWork(product.imgUrls[0], product.price);
          const image = formatResult[0];
          const price = formatResult[1];
          /*************************************/
          return (<Link to={ `/category/${ categoryId }/?product=${ product.id }` } key={ product.id }>
              <div className="col-sm-6 border panel panel-default">
                <div className="col-sm-6">
                  <img src={ image } className="responsive-image" />
                </div>
                <div className="col-sm-6">
                  <h6>{ product.title }</h6>     
                  <h6><strong>Quantity Available:</strong> { product.inventory }</h6>
                  <h6><strong>Price: </strong>{ price }</h6>
                </div>
              </div>
            </Link>)
        }
      })
    }
    /*********************************************/
    // Label Products section:
    let categoryName;
    if (selectedProduct.title) {
      categoryName = 'Single Product Selected';
    } else if (categoryId) {
      const resultArr = categories.filter(category => {
        return category.id === categoryId;
      })
      categoryName = resultArr[0].name;
    } else {
      categoryName = 'all Categories';
    }
    /*********************************************/
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 marginbelow">
            <h6>Select a category (below) or enter search term (above)</h6>
          </div>
          <div className="col-sm-2 panel panel-default">
            <div className="col-sm-12 marginbelow panel-heading colWidth100">
              <h6 className="center">CATEGORIES</h6>
            </div>
            <div className="col-sm-12 marginbelow">
              { renderCategories }
            </div>
          </div>
          <div className="col-sm-10 panel panel-default">
            <div className="col-sm-12 marginbelow panel-heading colWidth100">
              <h6 className="center">PRODUCTS - ( { categoryName } )</h6>
            </div>
            <div className="col-sm-12 marginbelow">
              { renderProducts }
            </div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state;
}

export default connect(mapStateToProps)(Home);
