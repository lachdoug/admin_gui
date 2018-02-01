class V0
  module Api
    module Services
      class Ldap

        def net_ldap_distribution_lists_for_user(ldap, user_uid)

          mailbox = net_ldap_user_mailbox(ldap, user_uid)
          email_aliases = net_ldap_user_email_addresses(ldap, user_uid)
          email_addresses = [ mailbox ] + email_aliases

          result = []
          email_addresses.each do |email_address|
            filter =
              Net::LDAP::Filter.eq( "objectclass", "posixGroup" ) &
              Net::LDAP::Filter.eq( "memberUid", email_address )
            base = "ou=Distribution Groups,dc=engines,dc=internal"
            ldap.search(:base => base, :filter => filter ) do |entry|
              result << {
                distribution_group: entry.cn[0],
                email_address: email_address
              }
            end
          end
          result

        end


        def net_ldap_user_distribution_groups_remove(ldap, user_uid)

          mailbox = net_ldap_user_mailbox(ldap, user_uid)
          email_aliases = net_ldap_user_email_addresses(ldap, user_uid)
          email_addresses = [ mailbox ] + email_aliases

          result = {
            mailbox: mailbox,
            distribution_groups: []
          }
          email_addresses.each do |email_address|
            filter =
              Net::LDAP::Filter.eq( "objectclass", "posixGroup" ) &
              Net::LDAP::Filter.eq( "memberUid", email_address )
            base = "ou=Distribution Groups,dc=engines,dc=internal"
            ldap.search(:base => base, :filter => filter ) do |entry|
              result[:distribution_groups] << {
                distribution_group: entry.cn[0],
                email_address: email_address
              }
            end
          end
          result

        end



        def net_ldap_user_create_distribution_group( ldap, user_uid, distribution_group )
          mailbox = net_ldap_user_mailbox(ldap, user_uid)
          dn = "cn=#{distribution_group},ou=Distribution Groups,dc=engines,dc=internal"
          entry = net_ldap_find_entry_by_dn(ldap, dn)
          net_ldap_add_attribute_value_to_entry( ldap, entry, "memberuid", mailbox )
        end

      end
    end
  end
end
