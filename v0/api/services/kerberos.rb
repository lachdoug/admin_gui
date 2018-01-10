class V0
  module Api
    module Services
      class Kerberos

        require 'kerberos_authenticator'

        attr_reader :last_result, :settings

        def initialize(settings)
          # KerberosAuthenticator.setup do |config|
          #   config.server = settings.kerberos_server
          #   config.keytab_path = settings.kerberos_keytab_path
          # end
          @settings = settings
        end

        def auth(username, password)

          KerberosAuthenticator.setup do |config|
            config.server = settings.kerberos_server
            config.keytab_path = settings.kerberos_keytab_path
          end

          begin
            { result: "Success: #{KerberosAuthenticator.authenticate!(username, password)}" }
            # out[:kerberos_ticket] = KerberosAuthenticator.krb5::Creds.new
          rescue KerberosAuthenticator::Error => e
            { result: "Error: #{e.inspect}" }
          end

        end


        private



      end
    end
  end
end
