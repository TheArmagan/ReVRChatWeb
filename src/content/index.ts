import '../app.css'
import { mount } from 'svelte'
import App from './App.svelte'

// Take over the VRChat page
const root = document.createElement('div')
root.id = 'revrchat-root'
document.body.replaceChildren(root)

mount(App, { target: root })
