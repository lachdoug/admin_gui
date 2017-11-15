function tree (treeData) {
  return {
    $components: [

      {
        $components: [
          {
            class: "tree",
            $components: [
              {
                $type: "ul",
                $components: [
                  treeBranch(treeData)
                ]
              }
            ],
          }
        ]
      },
    ]
  };

};


function treeBranch(branchData) {
  return {
    $type: "li",

    _branchData: branchData,

    $components: [
      {
        class: "btn btn-custom toggle_node",
        title: "Expand " + branchData.name,
        $components: [
          icon ( { icon: "fa fa-caret-right", text: branchData.name } )
        ],
        onclick: function () {
          var children = $(this).parent("li").find("ul");
          if ( children[0].$components.length == 0 ) {
            children[0].$components = [
              {
                $type: "li",
                $components: [
                  pp( branchData.content || branchData.name ),
                ].concat(
                  treeBranchBranches( branchData.children )
                )
              }
            ];
            children.show();
            $(this).attr( "title", "Collapse " + branchData.name ).find( ".fa-caret-right" ).addClass( "fa-caret-down" ).removeClass( "fa-caret-right" );
          } else {
            children.hide("fast");
            children[0].$components = [];
            $(this).attr( "title", "Expand " + branchData.name ).find( ".fa-caret-down" ).addClass( "fa-caret-right" ).removeClass( "fa-caret-down" );
          };
        },
      },
      {
        $type: "ul",
        $components: [

        ]
      }
    ]
  };

};


function treeBranchBranches( branchesData ) {

    return branchesData.map( function (branchData) {
      return treeBranch(branchData);
    } );

};
