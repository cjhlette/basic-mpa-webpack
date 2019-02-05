/**
 * 모든 페이지 최초 로드 스크립트
 */
import '@babel/polyfill'
import $ from 'jquery'

// import 'normalize.css/normalize.css'
import '../sass/app.scss'

console.log('%c app.js load','color:red');

$(document).ready(function(){
  console.log('%c App.js document ready','color:blue');
});
