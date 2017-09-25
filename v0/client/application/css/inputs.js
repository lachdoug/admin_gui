var $cssInputs = css( `

select:invalid, textarea:invalid, input:invalid {
	border-color: #48D;
	-webkit-box-shadow: 0 0 8px #48D;
  box-shadow: 0 0 8px #48D;
}

.checkbox input:invalid {
  background-color: #48D;
	-webkit-box-shadow: 0 0 8px #48D;
  box-shadow: 0 0 8px #48D;
}

`);
