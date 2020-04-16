import React, { useState, useEffect } from 'react'
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react'
import Link from 'next/link'
import axios from 'axios'
import catchErrors from '../utils/catchErrors'
import baseUrl from '../utils/baseUrl'
import { handleLogin } from '../utils/auth'

const INITIAL_USER = {
  name: '',
  email: '',
  password1: '',
  password2: '',
}

function Signup() {
  const [user, setUser] = useState(INITIAL_USER)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user])

  function handleChange(e) {
    const { name, value } = e.target
    setUser(prevState => ({ ...prevState, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (user.password1 === user.password2) {
      try {
        // make request to signup user
        setLoading(true)
        setError('')
        const url = `${baseUrl}/api/signup`
        const payload = { ...user }
        const response = await axios.post(url, payload)
        handleLogin(response.data)
      } catch (err) {
        catchErrors(err, setError)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
      setError('Passwords do not match. Please try again.')
      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }


  return <>
    <Message
      attached
      icon="settings"
      header="Get Started!"
      content="Create a new account"
      color="teal"
    />
    <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
      <Message
        error
        header="Oops!"
        content={error}
      />
      <Segment>
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          label="Name"
          placeholder="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
        <Form.Input
          fluid
          icon="envelope"
          iconPosition="left"
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          label="Password"
          placeholder="Password"
          name="password1"
          type="password"
          value={user.password1}
          onChange={handleChange}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          label="Confirm Password"
          placeholder="Confirm Password"
          name="password2"
          type="password"
          value={user.password2}
          onChange={handleChange}
        />
        <Button
          disabled={disabled || loading}
          icon="signup"
          type="submit"
          color="orange"
          content="Signup"
        />
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help" />
      Existing user? {" "}
      <Link href="/login">
        <a>Login here</a>
      </Link> {" "}instead.
    </Message>
  </>;
}

export default Signup;
