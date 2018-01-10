class V0
  module Api
    module Services
      class Ldap

        def net_ldap_groups(ldap)
          result = []
          ldap.search(
            filter: Net::LDAP::Filter.eq( "objectClass", "posixGroup" ),
            base: "ou=Groups,dc=engines,dc=internal" ) do |entry|
            result << entry.cn[0]
          end
          result
        end


      end
    end
  end
end
