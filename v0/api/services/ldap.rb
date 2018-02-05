class V0
  module Api
    module Services
      class Ldap

        require 'net/ldap'
        # require 'net/ntlm'
        # require 'sasl'
        # require 'kconv'
        require 'gssapi'

        class Net::LDAP::Connection
          MODIFY_OPERATIONS =
              { :add => 0,
                :delete => 1,
                :replace => 2,
                :increment => 3
              }
        end


        def initialize(settings)
          @settings = settings
        end

        def ldap_error(ldap, prepend_message)
          message = [
            prepend_message,
            ldap.get_operation_result.message,
            ldap.get_operation_result.error_message
          ].join("\n\n")
          raise NonFatalError.new message, 405
        end

        ########################################################################
        ## Users
        ########################################################################

        def users
          net_ldap do |ldap|
            net_ldap_users(ldap)
          end
        end

        def create_user( data )
          net_ldap do |ldap|
            net_ldap_create_user ldap, data
          end
        end

        def user(user_uid)
          net_ldap do |ldap|
            net_ldap_user ldap, user_uid
          end
        end

        def user_email(user_uid)
          net_ldap do |ldap|
            net_ldap_user_email ldap, user_uid
          end
        end

        def delete_user(user_uid)
          net_ldap do |ldap|
            user = net_ldap_find_user_by_uid ldap, user_uid
            net_ldap_delete_entry_by_dn ldap, user.dn
          end
        end

        def update_user(user_uid, data)
          net_ldap do |ldap|
            entry = net_ldap_find_user_by_uid ldap, user_uid
            newrdn = "cn=#{data[:first_name]} #{data[:last_name]}"
            net_ldap_replace_attribute_value_on_entry ldap, entry, "givenname", data[:first_name]
            net_ldap_replace_attribute_value_on_entry ldap, entry, "sn", data[:last_name]
            net_ldap_rename_entry_by_dn ldap, entry.dn, newrdn
          end
        end

        ########################################################################
        ## User - User groups
        ########################################################################

        def user_available_groups(user_uid)
          user_groups - user_current_groups(user_uid)
        end

        def user_current_groups(user_uid)
          current_groups = nil
          net_ldap do |ldap|
            current_groups = net_ldap_groups_for_user ldap, user_uid
          end
          current_groups
        end

        def user_new_add_to_group( user_uid )
          {
            available_groups: user_available_groups(user_uid)
          }
        end

        def user_new_remove_from_group( user_uid )
          {
            current_groups: user_current_groups(user_uid)
          }
        end

        def user_add_to_group( user_uid, group_name )
          net_ldap do |ldap|
            if group_name.is_a? Array
              group_name.each do |gn|
                net_ldap_user_add_to_group ldap, user_uid, gn
              end
            else
              net_ldap_user_add_to_group ldap, user_uid, group_name
            end
          end
        end

        def user_remove_from_group( user_uid, group_name )
          net_ldap do |ldap|
            if group_name.is_a? Array
              group_name.each do |gn|
                net_ldap_user_remove_from_group ldap, user_uid, gn
              end
            else
              net_ldap_user_remove_from_group ldap, user_uid, group_name
            end
          end
        end

        ########################################################################
        ## User - Email mailbox
        ########################################################################

        def user_setup_email( user_uid, email_domain )
          net_ldap do |ldap|
            net_ldap_user_setup_email ldap, user_uid, email_domain
          end
        end

        def user_disable_email( user_uid )
          net_ldap do |ldap|
            net_ldap_user_disable_email ldap, user_uid
          end
        end

        def user_edit_mailbox_domain( user_uid )
          result = {}
          net_ldap do |ldap|
            result[:domains] = net_ldap_email_domains ldap
            result[:mailbox_domain] = net_ldap_user_mailbox( ldap, user_uid ).split("@")[1]
          end
          result
        end

        def user_update_mailbox_domain( user_uid, email_domain )
          net_ldap do |ldap|
            net_ldap_user_update_mailbox_domain ldap, user_uid, email_domain
          end
        end

        # def user_edit_mailbox_domain( user_uid )
        #   net_ldap do |ldap|
        #     net_ldap_user_edit_mailbox_domain ldap, user_uid
        #   end
        # end

        ########################################################################
        ## User - Email aliases
        ########################################################################

        def user_new_add_email_address( user_uid )
          result = {}
          net_ldap do |ldap|
            result[:domains] = net_ldap_email_domains ldap
            result[:default] = net_ldap_default_email_domain ldap
          end
          result
        end

        def user_email_addresses( user_uid )
          result = {}
          net_ldap do |ldap|
            result[:email_addresses] = net_ldap_user_email_addresses ldap, user_uid
          end
          result
        end

        def user_add_email_address( user_uid, email_address )
          net_ldap do |ldap|
            net_ldap_user_add_email_address ldap, user_uid, email_address
          end
        end

        def user_remove_email_address( user_uid, email_address )
          net_ldap do |ldap|
            net_ldap_user_remove_email_address ldap, user_uid, email_address
          end
        end

        ########################################################################
        ## User - Distribution groups
        ########################################################################

        def user_distribution_groups_remove( user_uid )
          net_ldap do |ldap|
            net_ldap_user_distribution_groups_remove(ldap, user_uid)
          end
        end

        def user_new_distribution_group( user_uid )
          net_ldap do |ldap|
            all_distribution_groups =
              net_ldap_distribution_lists(ldap).
              map{ |dl| dl[:name] }
            user_distribution_groups =
              net_ldap_distribution_lists_for_user(ldap, user_uid).
              map{ |dl| dl[:distribution_group] }
            { distribution_groups: all_distribution_groups - user_distribution_groups }
          end
        end

        def user_create_distribution_group( user_uid, distribution_group )
          net_ldap do |ldap|
            net_ldap_user_create_distribution_group ldap, user_uid, distribution_group
          end
        end

        # def user_email_addresses( user_uid )
        #   result = {}
        #   net_ldap do |ldap|
        #     result[:email_addresses] = net_ldap_user_email_addresses ldap, user_uid
        #   end
        #   result
        # end
        #
        # def user_remove_email_address( user_uid, email_address )
        #   net_ldap do |ldap|
        #     net_ldap_user_remove_email_address ldap, user_uid, email_address
        #   end
        # end

        ########################################################################
        ## User groups
        ########################################################################

        def user_groups
          net_ldap do |ldap|
            net_ldap_user_groups ldap
          end
        end

        def user_group( user_group_name )
          net_ldap do |ldap|
            net_ldap_user_group ldap, user_group_name
          end
        end

        ########################################################################
        ## Email domains
        ########################################################################

        def email_domains
          result = {}
          net_ldap do |ldap|
            result[:domains] = net_ldap_email_domains ldap
            result[:default] = net_ldap_default_email_domain ldap
          end
          result
        end

        def create_email_domain( data )
          net_ldap do |ldap|
            net_ldap_create_email_domain ldap, data
          end
          { email_domain: data[:email_domain] }
        end

        def delete_email_domain( email_domain )
          net_ldap do |ldap|
            net_ldap_delete_email_domain ldap, email_domain
            net_ldap_clear_default_email_domain( ldap ) if net_ldap_default_email_domain(ldap) == email_domain
          end
          {}
        end

        def email_domain( email_domain )
          result = {
            email_domain: email_domain
          }
          net_ldap do |ldap|
            result[:default] = ( net_ldap_default_email_domain(ldap) == email_domain )
          end
          result
        end

        def set_default_email_domain(email_domain)
          net_ldap do |ldap|
            net_ldap_set_default_email_domain ldap, email_domain
          end
          { email_domain: email_domain }
        end

        ########################################################################
        ## Email addresses
        ########################################################################

        def email_addresses
          net_ldap do |ldap|
            net_ldap_email_addresses ldap
          end
        end

        def email_address(email_address)
          net_ldap do |ldap|
            net_ldap_email_address ldap, email_address
          end
        end

        ########################################################################
        ## Distribution lists
        ########################################################################

        def distribution_lists
          result = {}
          net_ldap do |ldap|
            result[:distribution_lists] = net_ldap_distribution_lists ldap
          end
          result
        end

        def distribution_list(distribution_list_name)
          net_ldap do |ldap|
            net_ldap_distribution_list ldap, distribution_list_name
          end
        end

        def distribution_lists_new
          result = {}
          net_ldap do |ldap|
            result[:domains] = net_ldap_email_domains ldap
            result[:default] = net_ldap_default_email_domain ldap
          end
          result
        end

        def distribution_lists_create(data)
          net_ldap do |ldap|
            net_ldap_create_email_distribution_list ldap, data
          end
        end

        def distribution_list_edit( distribution_list_name )
          net_ldap do |ldap|
            net_ldap_distribution_list_edit ldap, distribution_list_name
          end
        end

        def distribution_list_update( distribution_list_name, data )
          net_ldap do |ldap|
            net_ldap_distribution_list_update ldap, distribution_list_name, data
          end
        end

        def distribution_list_delete( distribution_list_name )
          net_ldap do |ldap|
            dn = "cn=#{distribution_list_name},ou=Distribution Groups,dc=engines,dc=internal"
            net_ldap_delete_entry_by_dn ldap, dn
          end
        end

        def distribution_list_new_email_address( distribution_list_name )
          net_ldap do |ldap|
            mailbox_and_alias_email_addresses =
              net_ldap_email_mailboxes_email_addresses(ldap).map{ |email_address| email_address[:email_address] } +
              net_ldap_email_aliases_email_addresses(ldap).map{ |email_address| email_address[:email_address] }
            existing_email_addresses =
              net_ldap_distribution_list(ldap, distribution_list_name)[:email_addresses]
            { email_addresses: mailbox_and_alias_email_addresses - existing_email_addresses }
          end
        end

        def distribution_list_create_email_address( distribution_list_name, email_address )
          net_ldap do |ldap|
            dn = "cn=#{distribution_list_name},ou=Distribution Groups,dc=engines,dc=internal"
            entry = net_ldap_find_entry_by_dn(ldap, dn)
            net_ldap_add_attribute_value_to_entry( ldap, entry, "memberuid", email_address )
          end
        end

        def distribution_list_delete_email_address( distribution_list_name, email_address )
          net_ldap do |ldap|
            dn = "cn=#{distribution_list_name},ou=Distribution Groups,dc=engines,dc=internal"
            entry = net_ldap_find_entry_by_dn(ldap, dn)
            net_ldap_delete_attribute_value_from_entry( ldap, entry, "memberuid", email_address )
          end
        end

private

        def net_ldap

          host = "control.engines.internal"
          principal = "host" # "krbtgt/ENGINES.INTERNAL@ENGINES.INTERNAL"
          keytab = @settings.kerberos_ldap_keytab_path
xxxx
          gssapi_ctx = GSSAPI::Simple.new(host, principal, keytab)
    xxxx
          gssapi_token = gssapi_ctx.init_context(nil) # .force_encoding('binary')
xxxx
          raise NonFatalError.new "SASL gssapi_token: #{gssapi_token}", 405

          challenge_response = Proc.new do |cred|
            # pref = SASL::Preferences.new(
            #   digest_uri: "ldap/ldap",
            #   has_password?: true,
            #   username: "cn=admin,dc=engines,dc=internal",
            #   password: "password"
            # )
            # sasl = SASL.new("DIGEST-MD5", pref)
            # response = sasl.receive("challenge", cred)
            # byebug
            # response[1]
            puts "SASL cred: #{cred}"
            true
          end

          auth = {
            method: :sasl,
            mechanism: "GSSAPI",
            initial_credential: gssapi_token,
            challenge_response: challenge_response
          }

          # auth = {
          #   :method => :simple,
          #   :username => "cn=admin,dc=engines,dc=internal",
          #   :password => "password"
          # }

          Net::LDAP.open(:host => "ldap", :auth => auth) do |ldap|
            yield ldap
          end

        end
      end
    end
  end
end
