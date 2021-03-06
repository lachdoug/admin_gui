var $installNewApp = {

	$cell: true,
	id: "installNewApp",

	_blueprintUrl: null,
	_data: null,

	_live: function( appData, cancelFunc ) {

		this._blueprintUrl = appData.blueprint_url;
		this._iconUrl = appData.icon_url;
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

		var blueprintUrl = this._blueprintUrl

		apiRequest({
			action: '/system/install',
			params: { blueprint_url: blueprintUrl },
			callbacks: {
				200: function(response) {
					installNewApp._data = response
					installNewApp._renderForm();
				},
				405: function (response) {
					alert( response.error.message );
					installNewApp._cancelFunc();
				}
			}
		});

	},


	_renderForm: function () {

		installNewAppForm.$components = [
			installNewApp._form(),
		];

	},

	_form: function () {

		var blueprint = this._data.blueprint;
		var name = this._availableEngineNameFor(blueprint.software.base.name);
		var heading = dig ( blueprint, "metadata", "software", "display", "label" ) ||
									dig (	blueprint, "metadata", "software", "display", "title" ) ||
									name;
		var comment = dig ( blueprint, "software", "base", "install_form_comment" );
		var blueprintUrl = this._blueprintUrl;
		var iconUrl = this._iconUrl;
		var requiredMemory = dig ( blueprint, "software", "base", "memory", "required" ) || 0;
		var recommendedMemory = dig ( blueprint, "software", "base", "memory", "recommended" ) || 0;
		var country = this._data.locale.country_code;
		var language = this._data.locale.lang_code;
		var defaultHttpProtocol = dig ( blueprint, "software", "base", "http_protocol" );
		var defaultDomain = this._data.default_domain;
		var domains = this._data.domains;
		var installedApps = this._data.installed_apps;
		var environmentVariables = blueprint.software.environment_variables || [];
		var serviceConfigurations = blueprint.software.service_configurations || [];
		var installedPackagesRequiringAuthentication = ( blueprint.software.installed_packages || [] ).filter( function( obj ) { return obj.authentication } );

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
							class: "installNewAppFormCustomCollapse",
							wrapperClass: "pull-right",
							icon: "fa fa-edit",
							text: "Custom",
							onclick: function () {
								$(".installNewAppFormCustomCollapse").toggle();
							}
						} ),
					]
				},
				{
					style: "display: none;",
					class: "installNewAppFormCustomCollapse",
					$components: [
						formField({ type: "hidden", name: "data[blueprint_url]", value: blueprintUrl }),
						formField({ type: "hidden", name: "data[icon_url]", value: iconUrl }),
						formField( {
							name: "data[engine_name]",
							id: "installNewAppFormField_container_name",
							label: "Name",
							value: name,
							onchange: function( e ) {
								installNewApp._checkContainerNameReserved();
							},
						} ),
						formField( {
							type: "number",
							name: "data[memory]",
							id: "installNewAppFormField_memory",
							label: "Memory MB",
							min: requiredMemory,
							value: recommendedMemory,
							hint: "Required " + requiredMemory + "MB. Recommended " + recommendedMemory + "MB."
						} ),
						legend ( { text: "Locale" } ),
						formField( {
							type: "country",
							name: "data[country_code]",
							id: "installNewAppFormField_country",
							label: "Country",
							value: country
						} ),
						formField( {
							type: "language",
							name: "data[language_code]",
							id: "installNewAppFormField_language",
							label: "Language",
							value: language
						} ),
						legend ( { text: "Network" } ),
						formField( {
							type: "select",
							name: "data[http_protocol]",
							id: "installNewAppFormField_http_protocol",
							label: "HTTP Protocol",
							collection: availableHttpProtocols( defaultHttpProtocol ),
							value: defaultHttpProtocol
						}),
						formField( {
							name: "data[host_name]",
							id: "installNewAppFormField_host_name",
							label: "Host name",
							value: name.replace(/_/g,'-'),
							onchange: function( e ) {
								installNewApp._checkFqdnReserved();
							},
						}),
						formField( {
							type: "select",
							name: "data[domain_name]",
							id: "installNewAppFormField_domain_name",
							label: "Domain name",
							value: defaultDomain,
							collection: domains,
							onchange: function( e ) {
								installNewApp._checkFqdnReserved();
							},
						} ),
						legend ( { text: "Sharing" } ),
						formField( {
							type: "select",
							name: "data[permission_as]",
							label: "Permission as",
							collectionIncludeBlank: true,
							collection: installedApps,
							placeholder: " ",
							value: "",
							required: false,
						} ),
						serviceConfigurations.length ? legend ( { text: "Services" } ) : {},
						{ $components: serviceConfigurations.map(
							function (obj, i) {
								return installNewApp._formServiceConfigurationFields (obj, i);
							}
						) },
						environmentVariables.length ? legend ( { text: "Environment variables" } ) : {},
					]
				},
				{
					$components: environmentVariables.map(
						function (obj, i) {
							return installNewApp._formEnvironmentVariableField (obj, i)
						}
					)
				},
				installedPackagesRequiringAuthentication.length ? legend ( { text: "Package authentication" } ) : {},
				{ $components: installedPackagesRequiringAuthentication.map(
					function (obj, i) {
						return installNewApp._formInstalledPackagesAuthenticationFields (obj, i);
					}
				) },
				legend ( { text: "License" } ),
				licenseUrl ?
					{
						$components: [
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
										name: "data[license_accepted]",
										required: true
									}	)
								]
							},
						]
					}
				: { $type: "p", $text: "No license." },
				formCancel ( { onclick: installNewApp._cancelFunc } ),
				formSubmit( { onclick: installNewApp._checkFqdnReserved }),
			],
			action: "/system/install",
			callbacks: {
				200: function() {
					system._live();
				},
			}
		});

	},


	_availableEngineNameFor: function (base_name) {

		var reserved_names = this._data.reserved.container_names;
		var name = base_name.substring ( 0, 16 )
		var index = 2
		while ($.inArray ( name, reserved_names ) > -1) {
			max_name_length = 16 - index.toString().length;
			name = base_name.substring ( 0, max_name_length ) + index.toString();
			index ++
		};
		return name;

	},

	_checkFqdnReserved: function () {
		var fqdn = $("#installNewAppFormField_host_name").val() + '.' + $("#installNewAppFormField_domain_name").val();
		if( $.inArray( fqdn, installNewApp._data.reserved.fqdns ) > -1 ) {
			if ( !$("#installNewAppFormField_host_name").is(':visible') ) {
				$(".installNewAppFormCustomCollapse").toggle();
			};
			$("#installNewAppFormField_host_name")[0].setCustomValidity(
				fqdn + " is already in use."
			);
			return true;
		} else {
			$("#installNewAppFormField_host_name")[0].setCustomValidity('')
			return true;
		};
	},


	_checkContainerNameReserved: function () {
		var name = $("#installNewAppFormField_container_name").val();
		if( $.inArray( name, installNewApp._data.reserved.container_names ) > -1 ) {

			if ( !$("#installNewAppFormField_container_name").is(':visible') ) {
				$(".installNewAppFormCustomCollapse").toggle();
			};

			$("#installNewAppFormField_container_name")[0].setCustomValidity(
				name + " is already in use."
			);
		} else {
			$("#installNewAppFormField_container_name")[0].setCustomValidity('')
		};
	},


	_formEnvironmentVariableField: function (field, i) {
		if ( field.ask_at_build_time != true ) {
			return {};
		} else {
			field.id = "installNewAppFormFieldEnvironmentVariable_" + i;
			field.name_prefix = "data[environment_variables]";
			return {
				class: ( field.mandatory == true ? "" : "collapse installNewAppFormCustomCollapse" ),
				$components: [
					enginesField(field)
				]
			};
		};

	},


	_formServiceConfigurationFields: function (obj, i) {

		var consumableService = this._data.consumable_services.find(
			function (consumable_service) {
				return ( consumable_service.service_definition.publisher_namespace == obj.publisher_namespace &&
				consumable_service.service_definition.type_path == obj.type_path );
			}
		);

		var selectOptions = serviceConsumerCreateType( consumableService );

		return {
			id: "installNewAppFormFieldServiceConfiguration_" + i,
			$components: [
				formField({ type: "hidden", name: "data[services][][publisher_namespace]", value: consumableService.service_definition.publisher_namespace }),
				formField({ type: "hidden", name: "data[services][][type_path]", value: consumableService.service_definition.type_path }),
				formField( {
					type: "select",
					label: consumableService.service_definition.title || ( consumableService.service_definition.publisher_namespace + '/' + consumableService.service_definition.type_path ),
					collection: selectOptions,
					id: "installNewAppFormFieldServiceConfiguration_" + i + "_createType",
					name: "data[services][][create_type]"
				} ),
				( consumableService.shareable.length == 0 ? {} :
					formField( {
						type: "select",
						label: false,
						name: "data[services][][share]",
						collection: installNewApp._formServiceConfigurationShareableServiceOptions(consumableService),
						dependOn: {
							input: "installNewAppFormFieldServiceConfiguration_" + i + "_createType",
							value: "share"
						}
					})
				 ),
				( consumableService.adoptable.length == 0 ? {} :
					formField( {
						type: "select",
						label: false,
						name: "data[services][][adopt]",
						collection: installNewApp._formServiceConfigurationAdoptableServiceOptions(consumableService),
						dependOn: {
							input: "installNewAppFormFieldServiceConfiguration_" + i + "_createType",
							value: "adopt"
						}
					})
				 ),
			],
		};

	},

	_formInstalledPackagesAuthenticationFields: function (obj, i) {

		var result = {
			$components: [
				formField({ type: "hidden", name: "data[installed_packages][][name]", value: obj.name }),
			]
		}

		if ( obj.authentication !== 'credentials' ) {
			result.$components.push(
				formField({ type: "hidden", name: "data[installed_packages][][type]", value: "credentials" }),
				formField({ type: "string", label: obj.name, placeholder: "Username", required: true, name: "data[installed_packages][][credentials][username]" }),
				formField({ type: "password", label: false, placeholder: "Password", required: true, name: "data[installed_packages][][credentials][password]" })
			)
		} else if ( obj.authentication !== 'key' ) {
			result.$components.push(
				formField({ type: "hidden", name: "data[installed_packages][][type]", value: "key" })
			)
			if ( installNewApp._data.repo_keys.length ) {
				result.$components.push(
					formField({
						id: "installNewAppFormInstalledPackagesAuthentication_" + i + "_keyType",
						type: "select",
						label: obj.name,
						name: "data[installed_packages][][key][type]",
						collection: [ [ "private_key", "Enter private key" ], [ "repo_key", "Select repo key" ] ] }),
					formField({
						type: "text",
						label: false,
						placeholder: "Key",
						required: true,
						name: "data[installed_packages][][key][private_key]",
						dependOn: {
							input: "installNewAppFormInstalledPackagesAuthentication_" + i + "_keyType",
							value: "private_key"
						}
					}),
					formField({
						type: "select",
						label: false,
						name: "data[installed_packages][][key][repo_key_name]",
						collection: installNewApp._data.repo_keys,
						dependOn: {
							input: "installNewAppFormInstalledPackagesAuthentication_" + i + "_keyType",
							value: "repo_key"
						}
					})
				)
			} else {
				result.$components.push(
					formField({ type: "hidden", name: "data[installed_packages][][key][type]", value: "private_key" }),
					formField({ type: "text", label: obj.name, placeholder: "Key", required: true, name: "data[installed_packages][][key][private_key]" }),
				)
			}
		}

		return result

	},

	_formServiceConfigurationShareableServiceOptions: function( consumableService ) {

		return consumableService.shareable.map(
			function( availableService ) {
				return this._formAvailableServiceOption( availableService );
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


	_formAvailableServiceOption: function( availableService ) {
		var parent = availableService.parent;
		var serviceHandle = availableService.service_handle;
		var optionValue = parent + "#" + serviceHandle;
		var optionLabel = ( parent + ( parent == serviceHandle ? "" : " - " + serviceHandle ) );
		return [ optionValue, optionLabel ];
	}

};
