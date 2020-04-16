import App from "next/app";
import axios from 'axios'
import Layout from '../components/_App/Layout'
import { parseCookies, destroyCookie } from 'nookies'
import { redirectUser } from '../utils/auth'
import baseUrl from '../utils/baseUrl'
import Router from "next/router";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx)

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if (!token) {
      const isProtectedRoute = ctx.pathname === '/account' || ctx.pathname === '/create'
      if (isProtectedRoute) {
        redirectUser(ctx, '/login')
      }
    } else {
      try {
        const payload = { headers: { Authorization: token } }
        const url = `${baseUrl}/api/account`
        const response = await axios.get(url, payload)
        const user = response.data
        const isRoot = user.role === 'root'
        const isAdmin = user.role === 'admin'
        // If user is authenticated but not root or admin role, then redirect from 'create page
        const isNotPermitted = !(isRoot || isAdmin) && ctx.pathname === '/create'
        if (isNotPermitted) {
          redirectUser(ctx, '/')
        }
        pageProps.user = user
      } catch (err) {
        console.error("Error getting current user. ", err)
        // Throw out invalid token
        destroyCookie(ctx, 'token')
        // Redirect to login page
        redirectUser(ctx, '/login')
      }
    }

    return { pageProps }
  }

  componentDidMount() {
    console.log("Logged out from storage");
    window.addEventListener('storage', this.syncLogout)
  }

  syncLogout = e => {
    if (e.key === 'logout') {
      Router.push('/login')
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
