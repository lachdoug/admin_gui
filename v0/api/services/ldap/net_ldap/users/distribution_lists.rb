class V0
  module Api
    module Services
      class Ldap

        def net_ldap_distribution_lists_for_user(ldap, uid)
          result = []
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixGroup" ) &
            Net::LDAP::Filter.eq( "memberUid", uid )
          base = "ou=Distribution Groups,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            result << entry.cn.join(' ')
          end
          result
        end


      end
    end
  end
end
