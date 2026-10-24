const chai = require('chai');
global.expect = chai.expect;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

// Load HTML content
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const { code: transformedScript } = babel.transformFileSync(
  path.resolve(__dirname, '..', 'index.js'),
  { presets: ['@babel/preset-env'] }
);

// Initialize JSDOM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

//Handle fetch
const fetchPkg = 'node_modules/whatwg-fetch/dist/fetch.umd.js';
dom.window.eval(fs.readFileSync(fetchPkg, 'utf-8'));

// Inject the transformed JavaScript into the virtual DOM
const scriptElement = dom.window.document.createElement("script");
scriptElement.textContent = transformedScript;
dom.window.document.body.appendChild(scriptElement);

// Expose JSDOM globals to the testing environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

async function waitForPost() {
  const deadline = Date.now() + 5000;

  while (!document.querySelector("#post-list h1")) {
    if (Date.now() >= deadline) {
      throw new Error("Timed out waiting for posts to render");
    }

    await new Promise(resolve => setTimeout(resolve, 25));
  }
}

// Sample test suite for JavaScript event handling
describe('Asynchronous Fetching ', () => {
  it('should fetch to external api and add information to page', async() => {
    await waitForPost();
    let postDisplay = document.querySelector("#post-list")
    expect(postDisplay.innerHTML).to.include('sunt aut')
    
  })
  it('should create an h1 and p element to add', async() => {
    await waitForPost();
    let h1 = document.querySelector("h1")
    let p = document.querySelector("p")
    expect(h1.textContent).to.include("sunt aut facere repellat")
    expect(p.textContent).to.include("quia et suscipit\nsuscipit")
  })
})