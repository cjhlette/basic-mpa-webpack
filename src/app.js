/**
 * 모든 페이지 최초 로드 스크립트
 */
import '@babel/polyfill'
import $ from 'jquery'

require('normalize.css/normalize.css');
require('../sass/app.scss');

$(document).ready(function(){
  console.log('%c App.js load','color:red');
});
