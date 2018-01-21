class V0
  module Api
    module Services
      class Ldap

        def net_ldap_user_groups( ldap )
          result = []
          ldap.search(
            filter: Net::LDAP::Filter.eq( "objectClass", "posixGroup" ),
            base: "ou=Groups,dc=engines,dc=internal" ) do |entry|
            result << entry.cn[0]
          end
          result
        end

        def net_ldap_user_group( ldap, user_group_name )
          dn = "cn=#{user_group_name},ou=Groups,dc=engines,dc=internal"
          entry = net_ldap_find_entry_by_dn ldap, dn
          {
            name: user_group_name,
            users: entry.respond_to?(:memberuid) ? entry.memberuid : []
          }
        end


      end
    end
  end
end
