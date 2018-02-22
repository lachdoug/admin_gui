class V0
  module Api
    module Services
      class Ldap

        def net_ldap_default_email_domain( ldap )
          result = nil
          ldap.search(
            base: "ou=default domain,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal" ) do |entry|
            entry.each do |k,v|
              result = v[0] if k == :dc
            end
          end
          result
        end

        def net_ldap_clear_default_email_domain( ldap )
          base = "ou=default domain,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal"
          filter = Net::LDAP::Filter.eq( "dc", "*" )
          entry = ldap.search( base: base, filter: filter )[0]
          if ldap.delete(dn: entry.dn)
            {}
          else
            ldap_error ldap, "Failed to clear default email domain."
          end
        end

        def net_ldap_set_default_email_domain( ldap, email_domain )
          base = "ou=default domain,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal"
          filter = Net::LDAP::Filter.eq( "dc", "*" )
          attributes = {
            dc: email_domain,
            objectclass: [ "dNSDomain" ],
          }
          entry = ldap.search( base: base, filter: filter )[0]
byebug
          if ( !entry || ( entry && ldap.delete(dn: entry.dn) ) ) &&
          ldap.add(dn: "dc=#{email_domain},#{base}", attributes: attributes)
            { email_domain: email_domain }
          else
            ldap_error ldap, "Failed to set default email domain."
          end

        end

        def net_ldap_email_domains( ldap )
          result = []
          ldap.search(
            base: "ou=domains,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal" ) do |entry|
            entry.each do |k,v|
              result << v[0] if k == :dc
            end
          end
          result
        end

        def net_ldap_delete_email_domain( ldap, email_domain )
          dn = "dc=#{email_domain},ou=domains,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal"

          if ldap.delete dn: dn
            return {}
          else
            ldap_error ldap, "Failed to delete email domain."
          end

        end

        def net_ldap_create_email_domain( ldap, data )
          email_domain = data[:email_domain]
          dn = "dc=#{email_domain},ou=domains,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal"
          attributes = {
            dc: email_domain,
            objectclass: [ "dNSDomain" ],
          }

          if ldap.add dn: dn, attributes: attributes
            return {
              email_domain: email_domain
            }
          else
            ldap_error ldap, "Failed to create email domain."
          end

        end

      end
    end
  end
end
