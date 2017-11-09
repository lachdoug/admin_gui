var $cssSystems = css( `

.system { box-shadow: 0 3px 9px rgba(0,0,0,.5); border: 1px solid #eee; padding: 15px; }
.system .services { border-top: 1px solid #eee; }

@media (min-width: 768px) {
  .system-containers {
      -webkit-column-count: 2;
      -moz-column-count: 2;
      column-count: 2;
  }
}
@media (min-width: 992px) {
  .system-containers {
      -webkit-column-count: 3;
      -moz-column-count: 3;
      column-count: 3;
  }
}
@media (min-width: 1200px) {
  .system-containers {
      -webkit-column-count: 4;
      -moz-column-count: 4;
      column-count: 4;
  }
}

.engines_container {
  margin-bottom: 5px;
  border: 1px solid #fff;
}
.engines_container:hover {
  border: 1px dotted #eeeeee;
}

`);
