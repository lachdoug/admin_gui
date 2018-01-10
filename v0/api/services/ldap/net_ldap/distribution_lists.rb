class V0
  module Api
    module Services
      class Ldap

        def net_ldap_distribution_lists(ldap)
          result = []
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixGroup" )
          base = "ou=Distribution Groups,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            result << entry.cn.join(' ')
          end
          result
        end

        def net_ldap_distribution_list(ldap, distribution_list)
          result = nil
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixGroup" ) &
            Net::LDAP::Filter.eq( "cn", distribution_list )
          base = "ou=Distribution Groups,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            result = {
              distribution_list: distribution_list,
              description: entry.description[0]
            }
          end
          result
        end


      end
    end
  end
end
