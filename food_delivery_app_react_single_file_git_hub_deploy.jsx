/*
FoodDeliveryApp - Single-file React demo + Deployment instructions

This textdoc contains:
1) A minimal React app (single-file App.jsx) with Login, Menu, and Cart pages using React Router.
2) Instructions to create the project locally, install deps, run the dev server.
3) Git Bash commands to initialize a repo and push to GitHub.
4) Instructions for deploying to GitHub Pages (using gh-pages) and alternative method.

HOW TO USE:
- Copy the code under "FILES" into the corresponding files in a new create-react-app or Vite React project.
- Replace <YOUR_GITHUB_USERNAME> and <YOUR_REPO_NAME> with your actual GitHub username and repository name when running git commands or in package.json homepage.

----------
FILES (place these in a new React project)
----------

1) package.json (only relevant parts shown — merge into your project package.json):

{
  "name": "food-delivery-app",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "gh-pages": "^5.0.0"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0"
  }
}


2) public/index.html (minimal):

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Food Delivery - Focus n. Faith</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>


3) src/index.jsx

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


4) src/App.jsx

import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

// Simple in-memory "auth" for demo
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // very basic validation — in real app, call API
    if (!email) return alert('Enter email')
    onLogin({ email })
    navigate('/menu')
  }

  return (
    <div className="page center">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        </label>
        <button type="submit">Login</button>
        <p className="muted">Demo login — any email works.</p>
      </form>
    </div>
  )
}

// Sample menu
const SAMPLE_MENU = [
  { id: 1, name: 'Margherita Pizza', price: 299, desc: 'Classic cheese & tomato' },
  { id: 2, name: 'Veg Burger', price: 149, desc: 'Crispy patty & lettuce' },
  { id: 3, name: 'Pasta Alfredo', price: 249, desc: 'Creamy white sauce pasta' },
  { id: 4, name: 'Masala Dosa', price: 99, desc: 'Crispy dosa with chutney' }
]

function Menu({ addToCart }) {
  return (
    <div className="page">
      <h2>Menu</h2>
      <div className="grid">
        {SAMPLE_MENU.map(item => (
          <div key={item.id} className="card menu-item">
            <h3>{item.name}</h3>
            <p className="muted">{item.desc}</p>
            <div className="row between">
              <strong>₹{item.price}</strong>
              <button onClick={() => addToCart(item)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Cart({ cartItems, updateQty, clearCart }) {
  const total = cartItems.reduce((s, it) => s + it.price * it.qty, 0)
  return (
    <div className="page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="muted">Cart is empty. Go to the <Link to="/menu">menu</Link>.</p>
      ) : (
        <div className="card">
          {cartItems.map(it => (
            <div key={it.id} className="row between cart-item">
              <div>
                <strong>{it.name}</strong>
                <div className="muted">₹{it.price} × {it.qty}</div>
              </div>
              <div className="row">
                <button onClick={() => updateQty(it.id, it.qty - 1)} disabled={it.qty <= 1}>-</button>
                <div className="pad">{it.qty}</div>
                <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
              </div>
            </div>
          ))}

          <hr />
          <div className="row between">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>
          <div className="row end">
            <button onClick={clearCart} className="outline">Clear</button>
            <button onClick={() => alert('Checkout flow not implemented in demo')}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Nav({ user, cartCount }) {
  return (
    <nav className="nav">
      <div className="brand"><Link to="/">FoodDelivery</Link></div>
      <div className="links">
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        <span className="muted">{user ? user.email : 'Guest'}</span>
      </div>
    </nav>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])

  function addToCart(item) {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function updateQty(id, qty) {
    setCart(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, qty) } : it).filter(it => it.qty > 0))
  }

  function clearCart() { setCart([]) }

  return (
    <BrowserRouter>
      <Nav user={user} cartCount={cart.reduce((s, i) => s + i.qty, 0)} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Login onLogin={setUser} />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cart} updateQty={updateQty} clearCart={clearCart} />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} FoodDelivery — Demo</footer>
    </BrowserRouter>
  )
}


5) src/styles.css (simple styles)

:root{ --bg:#f7f7f9; --card:#ffffff; --accent:#1f2937 }
*{box-sizing:border-box;font-family:Inter,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial}
body{margin:0;background:var(--bg);color:var(--accent)}
.container{max-width:1000px;margin:24px auto;padding:16px}
.nav{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--card);box-shadow:0 2px 6px rgba(0,0,0,.06)}
.nav .brand a{font-weight:700;text-decoration:none;color:inherit}
.nav .links a{margin-right:12px;text-decoration:none}
.page{padding:16px}
.card{background:var(--card);padding:16px;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.06)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.menu-item{display:flex;flex-direction:column;gap:8px}
.row{display:flex;align-items:center}
.row.between{justify-content:space-between}
.row.end{justify-content:flex-end}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh}
input{width:100%;padding:8px;margin-top:6px;margin-bottom:8px;border-radius:6px;border:1px solid #ddd}
button{padding:8px 12px;border-radius:8px;border:none;background:#111;color:#fff;cursor:pointer}
button.outline{background:transparent;border:1px solid #ddd;color:inherit;padding:6px 10px}
.muted{color:#666;font-size:14px}
.pad{padding:0 8px}
.cart-item{margin-bottom:10px}
.footer{text-align:center;padding:20px;color:#666}


----------
Quick local setup (using create-react-app)
----------
# 1) Create project (if you don't have one already)
npx create-react-app food-delivery-app
cd food-delivery-app

# 2) Install router and gh-pages
npm install react-router-dom
npm install --save-dev gh-pages

# 3) Replace src/ and public/ files with the code above (App.jsx, index.jsx, styles.css, public/index.html)
# 4) Update package.json: set "homepage" to https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>
# 5) Run locally
npm start

----------
Git Bash commands to create repo and push to GitHub
(Replace <YOUR_GITHUB_USERNAME> and <YOUR_REPO_NAME> where needed)

# inside project folder (food-delivery-app)
git init
git add .
git commit -m "Initial commit - Food Delivery demo"
git branch -M main
# create a repo on GitHub through the web UI or use gh cli. After creating, add remote:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main

----------
Deploy to GitHub Pages (using gh-pages)

# 1) Ensure package.json has "homepage" set to: "https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>"
# 2) Commit package.json changes
git add package.json
git commit -m "set homepage for gh-pages"

# 3) Install gh-pages (already in devDependencies if you followed package.json above)
npm install --save-dev gh-pages

# 4) Run deploy script (this will build and push to gh-pages branch)
npm run deploy

# After deploy, GitHub Pages will serve at the homepage URL. It may take a minute to become live.

Alternative manual method (useful without gh-pages):
- Build locally: npm run build
- Create a branch called gh-pages or push the build folder to a docs/ folder on main branch and enable GitHub Pages from repository settings (Source: main branch /docs folder)


----------
Notes & Next steps you might want to add:
- Replace demo in-memory login with a real API and secure auth.
- Persist cart to localStorage so it survives refresh.
- Add images, categories, filters, search, and payment integration.
- Add responsiveness tweaks and accessibility improvements.

*/

// End of file. You can edit this doc to copy code or extract files.
