import React, { useEffect } from 'react'
import axios from 'axios'
import ProductList from '../components/Index/ProductList'
import baseUrl from '../utils/baseUrl'

function Home({ products }) {
  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  // fetch data
  const url = `${baseUrl}/api/products`
  const response = await axios.get(url)
  // return response data as an object
  return { products: response.data }
  // this object will be merged with existing groups

}

export default Home;
