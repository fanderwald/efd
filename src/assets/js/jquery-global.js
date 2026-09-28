// WordPress loads jQuery globally. This shim allows ES modules
// (like Foundation, niceSelect, and custom code) to `import $ from 'jquery'`
// without bundling a duplicate copy.
const jQuery = window.jQuery || window.$;
export default jQuery;
export { jQuery };
