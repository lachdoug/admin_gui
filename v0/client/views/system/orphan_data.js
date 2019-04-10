var $systemOrphanData = {

	$cell: true,
	id: "systemOrphanData",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-compass", text: "System orphan data" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemDiagnostics._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							id: "systemOrphanDataContent",
							_data: null,
							_refresh: function ( data ) {
								this._data = data;
							},
							_removeGroupItem: function( groupIndex, itemIndex ) {

								$(this).find(".systemOrphanDataApp").eq( groupIndex )[0]._remove( itemIndex );
							},
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							$update: function () {
								this.$components = [ systemOrphanData._orphans( this._data ) ];
							},
						}
					]
				}
			}
		);
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/system/orphan_data",
			callbacks: {
				200: function( data ) {
					systemOrphanDataContent._refresh(data);
				},
			}
		});
	},


	_orphans: function( data ) {
		var groupedData = groupArrayBy( data, "parent" );
		var appNames = Object.keys( groupedData );
		return {
			$components: appNames.map( function( key, groupIndex ) {
   			return systemOrphanData._orphanApp ( key, groupedData[key], groupIndex );
			} ).concat( appNames.length == 0 ? { $type: "i", $text: "None" } : {} )
		};
	},


	_orphanApp: function ( appName, data, groupIndex ) {
		return collapse( {
			wrapperClass: "systemOrphanDataAppWrapper",
			text: appName,
			body: {
				class: "systemOrphanDataApp",
				_data: data,
				_remove: function( i ) {
					if ( this._data.length == 1 ) {
						$(this).parents(".systemOrphanDataAppWrapper").hide();
					} else {
						this._data.splice( i ,1 );
					};
				},
				$init: function () { this.$update() },
				$update: function () {
					this.$components = data.map( function( orphan, i ) {
		 				return systemOrphanData._orphan( orphan, groupIndex, i, data.length );
		 			} )
				},
			}
		} );
	},


	_orphan: function( data, groupIndex, itemIndex, orphanCount ) {
		var orphanId = ( data.publisher_namespace + "|" + data.type_path.replace(/\//g, "|") + "|" + data.parent + "|" + data.service_handle );
		var title = data.type + ( data.parent == data.service_handle ? "" : " (" + data.service_handle + ")" );

		return {
			class: "systemOrphanDataAppItem",
			$components: [
				{ $text: title },
				{
					$type: "a",
					class: "btn btn-lg btn-custom pull-left-md",
					$components: [
						icon( {
							icon: "fa fa-download",
							text: "Export"
						} )
					],
					href: "/services/" + serviceName + "/data/export",
					download: `Engines_${ serviceName
						}.data`
				},

				{
					class: "clearfix",
					$components: [
						button( {
							icon: "fa fa-download",
							text: "Download",
							wrapperClass: "pull-left-md",
							onclick: function () {
								systemOrphanData._download( orphanId );
							}
						}  ),
						button( {
							icon: "fa fa-trash-o",
							text: "Delete",
							wrapperClass: "pull-right-md",
							onclick: function () {
								if( confirm("Are you sure that you want to delete the " + title + " for " + data.parent + "?") ) {
									systemOrphanData._delete( orphanId, groupIndex, itemIndex );
								};
							}
						} ),
					]
				},
				( itemIndex + 1 == orphanCount ? {} : { $type: "hr" } ),
			]
		};
	},

	_delete: function( orphanId, groupIndex, itemIndex ) {
		apiRequest( {
			action: "/system/orphan_data/" + orphanId,
			method: "delete",
			callbacks: {
				200: function () {
					systemOrphanDataContent._removeGroupItem( groupIndex, itemIndex );
				}
			}
		} );
	},

};
