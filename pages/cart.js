import React, { useState } from 'react'
import { Segment } from 'semantic-ui-react'
import CartItemList from '../components/Cart/CartItemList'
import CartSummary from '../components/Cart/CartSummary'
import axios from 'axios'
import { parseCookies } from 'nookies'
import baseUrl from '../utils/baseUrl'
import catchErrors from '../utils/catchErrors'
import cookie from 'js-cookie'

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`
    const token = cookie.get('token')
    const payload = {
      params: { productId },
      headers: { Authorization: token }
    }
    const response = await axios.delete(url, payload)
    setCartProducts(response.data)
  }

  async function handleCheckout(paymentData) {
    try {
      setLoading(true)
      const url = `${baseUrl}/api/checkout`
      const token = cookie.get('token')
      const payload = { paymentData }
      const headers = { headers: { Authorization: token } }
      await axios.post(url, payload, headers)
      setSuccess(true)
    } catch (err) {
      catchErrors(err, window.alert)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Segment loading={loading}>
      <CartItemList
        user={user}
        products={cartProducts}
        handleRemoveFromCart={handleRemoveFromCart}
        success={success}
      />
      <CartSummary
        products={cartProducts}
        handleCheckout={handleCheckout}
        success={success}
      />
    </Segment>
  )
}

Cart.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx)
  if (!token) {
    return { products: [] };
  }
  const url = `${baseUrl}/api/cart`
  const payload = { headers: { Authorization: token } }
  const response = await axios.get(url, payload)
  console.log(response.data);
  return { products: response.data }
}

export default Cart;
