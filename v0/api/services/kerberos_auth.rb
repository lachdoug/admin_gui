class V0
  module Api
    module Services
      class KerberosAuth

        require 'kerberos_authenticator'

        attr_reader :last_result, :settings

        def initialize(settings)
          @settings = settings
        end

        def auth(username, password)
          KerberosAuthenticator.setup do |config|
            config.server = settings.kerberos_server
            config.keytab_path = settings.kerberos_ldap_keytab_path
          end
          begin
            { result: "Success: #{KerberosAuthenticator.authenticate!(username, password)}" }
          rescue KerberosAuthenticator::Error => e
            { result: "Error: #{e.inspect}" }
          end

        end

      end
    end
  end
end
