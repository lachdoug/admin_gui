class V0
  module Api
    module Services
      class Ldap

        def net_ldap_groups_for_user(ldap, uid)
          result = []
          ldap.search(
            filter: Net::LDAP::Filter.eq( "memberUid", uid ),
            base: "ou=Groups,dc=engines,dc=internal" ) do |entry|
            result << entry.cn[0]
          end
          result
        end

        def net_ldap_user_add_to_group( ldap, user_uid, group_name )
          ldap.modify(
            dn: "cn=#{group_name},ou=Groups,dc=engines,dc=internal",
            operations: [ [:add, :memberUid, user_uid ] ]
          )
        end

        def net_ldap_user_remove_from_group( ldap, user_uid, group_name )
          ldap.modify(
            dn: "cn=#{group_name},ou=Groups,dc=engines,dc=internal",
            operations: [ [:delete, :memberUid, user_uid ] ]
          )
        end

      end
    end
  end
end
