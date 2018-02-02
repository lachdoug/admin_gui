class V0
  module Api
    module Services
      class KerberosAdmin

        # require 'rkerberos'

        def initialize(settings)
          @kadm5 = Kerberos::Kadm5.new(settings.kerberos_keytab_path)
        end

        def create_user_signin(user_uid, password)
          @kadm5.create_principal user_uid, password
        end

        def update_user_password(user_uid, password)
          @kadm5.set_password(user_uid, password)
        end



      end
    end
  end
end
