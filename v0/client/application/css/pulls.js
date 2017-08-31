var $cssPulls = css( `

.pull-right-md {
  text-align: right;
  left: auto;
  right: 0;
  float: right;
}

.pull-left-md {
  text-align: left;
  right: auto;
  left: 0;
  float: left;
}

@media (max-width: 767px) {
  .pull-right-md {
    text-align: left;
    left: 0;
    right: auto;
    float: inherit;
  }

	.pull-left-md {
    text-align: left;
    left: 0;
    right: auto;
    float: inherit;
  }

}
`);
