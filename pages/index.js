import React, { useEffect } from 'react'
import axios from 'axios'

function Home({ products }) {
  console.log(products)
  // useEffect(() => {
  //   getProducts()
  // }, [])

  async function getProducts() {
    const url = 'http://localhost:3000/api/products'
    const response = await axios.get(url)
    console.log(response.data)
  }

  return <>home</>;
}

Home.getInitialProps = async () => {
  // fetch data
  const url = 'http://localhost:3000/api/products'
  const response = await axios.get(url)
  // return response data as an object
  return { products: response.data }
  // this object will be merged with existing groups

}

export default Home;
