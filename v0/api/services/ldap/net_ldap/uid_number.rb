class V0
  module Api
    module Services
      class Ldap

        def net_ldap_next_available_uidnumber(ldap)
          uidnumber = nil
          loop do
            uidnumber = net_ldap_uidnumber ldap
            
            break unless net_ldap_uidnumber_in_use(ldap, uidnumber)
            net_ldap_increment_uidnumber(ldap)
          end
          uidnumber
        end

        def net_ldap_increment_uidnumber(ldap)
          ldap.modify(
            dn: "cn=uidNext,ou=System,ou=Engines,dc=engines,dc=internal",
            operations: [ [:increment, :uidNumber, '1' ] ] )
        end

        def net_ldap_uidnumber_in_use(ldap, uidnumber)
          ldap.search(
            filter: Net::LDAP::Filter.eq( "uidnumber", uidnumber ),
            base: "ou=People,dc=engines,dc=internal").any?
        end

        def net_ldap_uidnumber(ldap)
          result = nil
          ldap.search(
            base: "cn=uidNext,ou=System,ou=Engines,dc=engines,dc=internal",
            attributes: [ 'uidnumber' ] ) do |entry|
            entry.each do |k,v|
              result = v[0] if k == :uidnumber
            end
          end
          result
        end

      end
    end
  end
end
