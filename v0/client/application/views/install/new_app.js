// https://raw.githubusercontent.com/EnginesBlueprints/PHPNavigator/master/blueprint.json
var $installNewApp = {

	$cell: true,
	id: "installNewApp",

	_blueprintUrl: null,
	_newAppData: null,

	_live: function( appBlueprintUrl, cancelFunc ) {

		this._blueprintUrl = appBlueprintUrl;
		this._cancelFunc = cancelFunc
		this._show();

	},


	_show: function () {

		modal._live ( {
			header: icon ( { icon: "fa fa-plus", text: "Install app" } ),
			body: {
				id: "installNewAppForm",
				$components: [
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
				]
			}
		} );
		this._load();

	},


	_load: function() {

		apiRequest({
			action: '/system/install?blueprint_url=' + encodeURIComponent( "https://raw.githubusercontent.com/EnginesBlueprints/test_engine/master/blueprint.json" || "https://raw.githubusercontent.com/EnginesBlueprints/PHPNavigator/master/blueprint.json" || this._blueprintUrl ),
			callbacks: {
				200: function(response) {
					installNewApp._newAppData = response
					installNewApp._renderForm();
				},
			}
		});

	},


	_renderForm: function () {

		installNewAppForm.$components = [
			installNewApp._form(),
		];

	},


	_failedToLoad: function (message) {

		installNewAppForm.$components = [
			{ $text: message }
		];

	},


	_form: function () {

		var blueprint = this._newAppData.blueprint;
		var name = this._availableEngineNameFor(blueprint.software.base.name);
		var heading = dig ( blueprint, "metadata", "software", "display", "label" ) ||
									dig (	blueprint, "metadata", "software", "display", "title" ) ||
									name;
		var comment = dig ( blueprint, "software", "base", "install_form_comment" );
		var blueprintUrl = this._blueprintUrl;
		var requiredMemory = dig ( blueprint, "software", "base", "memory", "required" ) || 0;
		var recommendedMemory = dig ( blueprint, "software", "base", "memory", "recommended" ) || 0;
		var country = this._newAppData.locale.country_code;
		var language = this._newAppData.locale.lang_code;
		var defaultHttpProtocol = dig ( blueprint, "software", "base", "http_protocol" );
		var defaultDomain = this._newAppData.default_domain;
		var domains = this._newAppData.domains;
		var environmentVariables = blueprint.software.environment_variables;
		var serviceConfigurations = blueprint.software.service_configurations;
		var licenseLabel = dig ( blueprint, "metadata", "software", "license", "label" );
		var licenseUrl = dig ( blueprint, "metadata", "software", "license", "url" );

		return form ( {
			components: [
				{ $type: "h4", $text: heading },
				comment ? { $components: [ markdown( comment ), { $type: "hr" } ] } : {},
				{
					class: "clearfix",
					$components: [
						button( {
							wrapperClass: "pull-right",
							icon: "fa fa-edit",
							text: "Custom",
							onclick: function () {
								$("#installNewAppFormCustomCollapse").toggle();
							}
						} ),
					]
				},
				{
					style: "display: none;",
					id: "installNewAppFormCustomCollapse",
					$components: [
						formField({ type: "hidden", name: "form[blueprint_url]", value: blueprintUrl }),
						formField( {
							name: "form[engine_name]",
							id: "installNewAppFormField_container_name",
							label: "Name",
							value: name
						} ),
						formField( {
							type: "number",
							name: "form[memory]",
							id: "installNewAppFormField_memory",
							label: "Memory MB",
							min: requiredMemory,
							value: recommendedMemory,
							hint: "Required " + requiredMemory + "MB. Recommended " + recommendedMemory + "MB."
						} ),
						legend ( { text: "Locale" } ),
						formField( {
							type: "country",
							name: "form[country_code]",
							id: "installNewAppFormField_country",
							label: "Country",
							value: country
						} ),
						formField( {
							type: "language",
							name: "form[language_code]",
							id: "installNewAppFormField_language",
							label: "Language",
							value: language
						} ),
						legend ( { text: "Network" } ),
						formField( {
							type: "select",
							name: "form[http_protocol]",
							id: "installNewAppFormField_http_protocol",
							label: "HTTP Protocol",
							collection: availableHttpProtocols( defaultHttpProtocol ),
							value: defaultHttpProtocol
						}),
						formField( {
							name: "form[host_name]",
							id: "installNewAppFormField_host_name",
							label: "Host name",
							value: name.replace('_','-')
						}),
						formField( {
							type: "select",
							name: "form[domain_name]",
							id: "installNewAppFormField_domain_name",
							label: "Domain name",
							value: defaultDomain,
							collection: domains.map(
								function (domain) {
									return domain.domain_name
								}
							),
						} ),
						legend ( { text: "Services" } ),
						{ $components: serviceConfigurations.map(
							function (obj, i) {
								return installNewApp._formServiceConfigurationFields (obj, i)
							}
						) },
						legend ( { text: "Environment variables" } ),
					]
				},
				{
					$components: environmentVariables.map(
						function (obj, i) {
							return installNewApp._formEnvironmentVariableFields (obj, i)
						}
					)
				},
				licenseUrl ?
					{
						$components: [
							legend ( { text: "License" } ),
							{
								$components: [
									{
										$type: "a",
										$text: ( licenseLabel || "Read the license" ),
										title: "Read the license",
										onclick: () => {
											openUrl( licenseUrl );
										}
									},
									formField( {
										type: "checkbox",
										label: "I have read and accept the license.",
										title: "Accept the license",
										name: "form[license_accepted]",
										required: true
									}	)
								]
							},
						]
					}
				: {},
				formCancel ( { onclick: "installNewApp._cancelFunc()" } ),
				formSubmit(),
			],
			action: "/system/install",
			callbacks: {
				200: function(response) {
					system._loadSystem();
				},
			}
		});

	},


	_availableEngineNameFor: function (base_name) {

		var reserved_names = this._newAppData.reserved.container_names;
		var name = base_name.substring ( 0, 16 )
		var index = 2
		while ($.inArray ( name, reserved_names ) != -1) {
			max_name_length = 16 - index.toString().length;
			name = base_name.substring ( 0, max_name_length ) + index.toString();
			index ++
		};
		return name;

	},

	_formEnvironmentVariableFields: function (obj, i) {
		if ( obj.ask_at_build_time != true ) {
			return null;
		} else {
			return {
				class: ( obj.mandatory == true ? "" : "collapse installNewAppFormCustomCollapse" ),
				$components: [
					enginesField(
						$.extend(
							obj,
							{ id: "installNewAppFormFieldEnvironmentVariable_" + i,
								name: "form[environment_variables][" + obj.name + "]",
								input: $.extend(
									( obj.input || {} ),
									{
										label: (
											( obj.input || {} ).label || obj.name
										)
									}
								)
							}
						)
					)
				]
			};
		};

	},


	_formServiceConfigurationFields: function (obj, i) {

		var consumableService = this._newAppData.consumable_services.find(
			function (consumable_service) {
				return ( consumable_service.service_definition.publisher_namespace == obj.publisher_namespace &&
				consumable_service.service_definition.type_path == obj.type_path );
			}
		);
		var selectOptions = {	new: "Create new" };
		if ( consumableService.sharable.length > 0 ) {
			selectOptions.share = "Share existing";
		};
		if ( consumableService.adoptable.length > 0 ) {
			selectOptions.adopt = "Adopt orphan";
		};
		return {
			id: "installNewAppFormFieldServiceConfiguration_" + i,
			$components: [
				formField({ type: "hidden", name: "form[services][][publisher_namespace]", value: consumableService.service_definition.publisher_namespace }),
				formField({ type: "hidden", name: "form[services][][type_path]", value: consumableService.service_definition.type_path }),
				formField( {
					type: "select",
					label: consumableService.service_definition.title,
					collection: selectOptions,
					id: "installNewAppFormFieldServiceConfiguration_" + i + "_create_type",
					name: "form[services][][create_type]"
				} ),
				( consumableService.sharable.length == 0 ? {} :
					formField( {
						type: "select",
						label: false,
						wrapperStyle: "margin-top: -30px;",
						name: "form[services][][share]",
						collection: installNewApp._formServiceConfigurationSharableServiceOptions(consumableService),
						dependOn: {
							input: "#installNewAppFormFieldServiceConfiguration_" + i + "_create_type",
							value: "share"
						}
					})
				 ),
				( consumableService.adoptable.length == 0 ? {} :
					formField( {
						type: "select",
						label: false,
						wrapperStyle: "margin-top: -30px;",
						name: "form[services][][adopt]",
						collection: installNewApp._formServiceConfigurationAdoptableServiceOptions(consumableService),
						dependOn: {
							input: "#installNewAppFormFieldServiceConfiguration_" + i + "_create_type",
							value: "adopt"
						}
					})
				 ),
			],
		};

	},


	_formServiceConfigurationSharableServiceOptions: function (consumableService) {

		return consumableService.sharable.map(
			function(availableService) {
				return this._formAvailableServiceOption (availableService)
			}.bind(this)
		);

	},


	_formServiceConfigurationAdoptableServiceOptions: function (consumableService) {

		return consumableService.adoptable.map(
			function(availableService) {
				return this._formAvailableServiceOption (availableService)
			}.bind(this)
		);

	},


	_formAvailableServiceOption: function(availableService) {
		var parentEngine = availableService.parent_engine;
		var serviceHandle = availableService.service_handle;
		var optionValue = parentEngine + "#" + serviceHandle;
		var optionLabel = ( parentEngine + ( parentEngine == serviceHandle ? "" : " - " + serviceHandle ) );
		return [ optionValue, optionLabel ];
	}

};
