class V0
  module Api
    module Services
      class Ldap

        # def net_ldap_email_addresses_for_user(ldap, uid)
        #   result = []
        #   filter =
        #     Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
        #     Net::LDAP::Filter.eq( "uid", uid )
        #   base = "dc=engines,dc=internal"
        #   ldap.search(:base => base, :filter => filter ) do |entry|
        #     entry.mailacceptinggeneralid.each do |email_address|
        #       result << email_address
        #     end
        #   end
        #   result
        #
        # end

        def net_ldap_user_email_addresses(ldap, user_uid)
          email_addresses = nil
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          ldap_user.respond_to?('mailacceptinggeneralid') ? ldap_user.mailacceptinggeneralid : []
        end



        def net_ldap_user_add_email_address( ldap, user_uid, email_address )
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          ldap.modify(dn: ldap_user.dn, operations: [ [:add, :mailacceptinggeneralid, email_address ] ] )
        end

        def net_ldap_user_remove_email_address( ldap, user_uid, email_address )
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          ldap.modify(dn: ldap_user.dn, operations: [ [:delete, :mailacceptinggeneralid, email_address ] ] )
        end

      end
    end
  end
end
