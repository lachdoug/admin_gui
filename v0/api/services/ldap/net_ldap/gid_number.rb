class V0
  module Api
    module Services
      class Ldap

        def net_ldap_next_available_gidnumber(ldap)
          gidnumber = nil
          loop do
            gidnumber = net_ldap_gidnumber ldap
            # byebug
            break unless net_ldap_gidnumber_in_use(ldap, gidnumber)
            net_ldap_increment_gidnumber(ldap)
          end
          gidnumber
        end

        def net_ldap_increment_gidnumber(ldap)
          ldap.modify(
            dn: "cn=gidNext,ou=System,ou=Engines,dc=engines,dc=internal",
            operations: [ [:increment, :gidNumber, '1' ] ] )
        end

        def net_ldap_gidnumber_in_use(ldap, gidnumber)
          ldap.search(
            filter: Net::LDAP::Filter.eq( "gidnumber", gidnumber ),
            base: "ou=Groups,dc=engines,dc=internal").any? ||
          ldap.search(
            filter: Net::LDAP::Filter.eq( "gidnumber", gidnumber ),
            base: "ou=Distribution groups,dc=engines,dc=internal").any?
        end

        def net_ldap_gidnumber(ldap)
          result = nil
          ldap.search(
            base: "cn=gidNext,ou=System,ou=Engines,dc=engines,dc=internal",
            attributes: [ 'gidnumber' ] ) do |entry|
            entry.each do |k,v|
              result = v[0] if k == :gidnumber
            end
          end
          result
        end

      end
    end
  end
end
