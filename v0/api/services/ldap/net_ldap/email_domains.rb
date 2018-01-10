class V0
  module Api
    module Services
      class Ldap

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

        def net_ldap_create_email_domain( ldap, email_domain )

          dn = "dc=#{email_domain},ou=domains,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal"
          attributes = {
            cn: email_domain,
            objectclass: [ "dNSDomain" ],
          }

          if ldap.add dn: dn, attributes: attributes
            return {
              email_domain: email_domain
            }
          else
            raise NonFatalError.new "Failed to create email domain.\n\n#{ldap.get_operation_result.message}", 405
          end

        end

      end
    end
  end
end
