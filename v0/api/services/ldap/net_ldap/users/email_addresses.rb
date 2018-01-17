class V0
  module Api
    module Services
      class Ldap

        # def net_ldap_email_addresses_for_user(ldap, uid)
        #   result = []
        #   filter =
        #     Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
        #     Net::LDAP::Filter.eq( "uid", uid )
        #   base = "dc=engines,dc=internal"
        #   ldap.search(:base => base, :filter => filter ) do |entry|
        #     entry.mailacceptinggeneralid.each do |email_address|
        #       result << email_address
        #     end
        #   end
        #   result
        #
        # end

        def net_ldap_user_email_addresses(ldap, user_uid)
          email_addresses = nil
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          ldap_user.respond_to?('mailacceptinggeneralid') ? ldap_user.mailacceptinggeneralid : []
        end

        def net_ldap_user_mailbox(ldap, user_uid)
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          ldap_user.maildrop[0]
        end


        def net_ldap_add_class_to_entry( ldap, entry, klass )
          unless entry.objectClass.include? klass
            unless ldap.modify(
              dn: entry.dn,
              operations: [ [:add, :objectClass, klass ] ]
            )
              ldap_error ldap, "Failed to add class '#{klass}'."
            end
          end
        end

        def net_ldap_remove_class_from_entry( ldap, entry, klass )
          if entry.objectClass.include? klass
            unless ldap.modify(
              dn: entry.dn,
              operations: [ [:delete, :objectClass, klass ] ]
            )
              ldap_error ldap, "Failed to add class '#{klass}'."
            end
          end
        end

        def net_ldap_add_attribute_value_to_entry( ldap, entry, attribute, value )
          if entry.respond_to? attribute
            result = ldap.modify(dn: entry.dn, operations: [ [:add, attribute, value ] ] )
          else
            result = ldap.add_attribute( entry.dn, attribute, value )
          end
          ldap_error ldap, "Failed to add value '#{value}' to attribute '#{attribute}'." unless result
        end

        def net_ldap_delete_attribute_from_entry( ldap, entry, attribute )
          if ldap.modify(dn: entry.dn, operations: [ [:delete, attribute, nil ] ] )
            {}
          else
            ldap_error ldap, "Failed to remove attribute '#{attribute}'."
          end
        end

        def net_ldap_replace_attribute_value_on_entry( ldap, entry, attribute, value )
          if ldap.modify(dn: entry.dn, operations: [ [:replace, attribute, value ] ] )
            {}
          else
            ldap_error ldap, "Failed to update attribute '#{attribute}'."
          end
        end

        def net_ldap_user_setup_email( ldap, user_uid, email_domain )

          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          email_address = "#{user_uid}@#{email_domain}"

          net_ldap_add_class_to_entry ldap, ldap_user, "postfixUser"
          net_ldap_add_attribute_value_to_entry ldap, ldap_user, "maildrop", email_address

          {
            user_uid: user_uid,
            email_address: email_address
          }

        end

        def net_ldap_user_update_mailbox_domain ( ldap, user_uid, email_domain )
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          email_address = "#{user_uid}@#{email_domain}"
          net_ldap_replace_attribute_value_on_entry ldap, ldap_user, "maildrop", email_address
        end


        def net_ldap_user_disable_email( ldap, user_uid )
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          net_ldap_delete_attribute_from_entry ldap, ldap_user, "maildrop"
          net_ldap_remove_class_from_entry ldap, ldap_user, "postfixUser"
        end

        def net_ldap_user_add_email_address( ldap, user_uid, email_address )
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          unless ldap.modify(dn: ldap_user.dn, operations: [ [:add, :mailacceptinggeneralid, email_address ] ] )
            ldap_error ldap, "Failed to create email address."
          end
          {
            user_uid: user_uid,
            email_address: email_address
          }
        end



        def net_ldap_user_remove_email_address( ldap, user_uid, email_address )
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          ldap.modify(dn: ldap_user.dn, operations: [ [:delete, :mailacceptinggeneralid, email_address ] ] )
        end

      end
    end
  end
end
