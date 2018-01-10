class V0
  module Api
    module Services
      class Ldap

        def net_ldap_find_entry_by_dn(ldap, dn)
          ldap.search( base: dn )[0]
        end


      end
    end
  end
end
