import '../app.css'
import { mount } from 'svelte'
import App from './App.svelte'

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Take over the VRChat page
const root = document.createElement('div')
root.id = 'revrchat-root'
document.body.replaceChildren(root)

mount(App, { target: root })
