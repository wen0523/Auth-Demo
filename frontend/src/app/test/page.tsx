'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [data, setData] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
      const result = await response.json()
      setMessage(result.message)
    } catch (error) {
      setMessage('Registration failed')
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
      const result = await response.json()
      setMessage(result.message)
    } catch (error) {
      setMessage('Login failed')
    }
  }

  const handleGetData = async () => {
    try {
      const response = await fetch('http://localhost:8000/getdata', {
        credentials: 'include'
      })
      
      if (response.status === 401) {
        // 尝试刷新Token
        const refreshResponse = await fetch('http://localhost:8000/refresh', {
          method: 'POST',
          credentials: 'include'
        })
        
        if (refreshResponse.ok) {
          // 重试获取数据
          const retryResponse = await fetch('http://localhost:8000/getdata', {
            credentials: 'include'
          })
          const result = await retryResponse.json()
          setData(JSON.stringify(result))
          return
        }
      }
      
      const result = await response.json()
      setData(JSON.stringify(result))
    } catch (error) {
      setMessage('Failed to fetch data')
    }
  }

  const handleSignout = async () => {
    try {
      await fetch('http://localhost:8000/signout', {
        method: 'POST',
        credentials: 'include'
      })
      setMessage('Logged out')
      setData('')
    } catch (error) {
      setMessage('Logout failed')
    }
  }

  const Clear = () => {
    setData('')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Auth Demo</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <button onClick={handleRegister} className="px-4 py-2 bg-blue-500 text-white border-none rounded-md cursor-pointer">Register</button>
        <button onClick={handleLogin} className="px-4 py-2 bg-green-500 text-white border-none rounded-md cursor-pointer">Login</button>
        <button onClick={handleGetData} className="px-4 py-2 bg-teal-500 text-white border-none rounded-md cursor-pointer">Get Data</button>
        <button onClick={handleSignout} className="px-4 py-2 bg-red-500 text-white border-none rounded-md cursor-pointer">Sign Out</button>
        <button onClick={Clear} className="px-4 py-2 bg-gray-500 text-white border-none rounded-md cursor-pointer">Clear</button>
      </div>
      <div className="mb-4 text-center text-red-500">{message}</div>
      <div className="text-center text-green-500">Protected Data: {data}</div>
    </div>
  )
}