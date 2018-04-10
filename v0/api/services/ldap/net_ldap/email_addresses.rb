class V0
  module Api
    module Services
      class Ldap

        def net_ldap_email_addresses(ldap)
          net_ldap_email_mailboxes_email_addresses(ldap) +
          net_ldap_email_aliases_email_addresses(ldap) +
          net_ldap_distribution_list_email_addresses(ldap)
        end

        def net_ldap_email_aliases_email_addresses(ldap)
          result = []
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
            Net::LDAP::Filter.eq( "mailacceptinggeneralid", "*" )
          base = "dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            
            entry.mailacceptinggeneralid.each do |email_address|
              result << {
                source_type: :alias,
                user_uid: entry.uid[0],
                email_address: email_address
              }
            end
          end
          result
        end

        def net_ldap_email_mailboxes_email_addresses(ldap)
          result = []
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
            Net::LDAP::Filter.eq( "maildrop", "*" )
          base = "dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            
            result << {
              source_type: :mailbox,
              user_uid: entry.uid[0],
              email_address: entry.maildrop[0]
            }
          end
          result
        end

        def net_ldap_distribution_list_email_addresses(ldap)
          net_ldap_distribution_lists(ldap).map do |distribution_list|
            {
              source_type: :list,
              distribution_list_name: distribution_list[:name],
              email_address: distribution_list[:name]
            }
          end
        end

        def net_ldap_email_address(ldap, email_address)
          result = nil
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
            Net::LDAP::Filter.eq( "mailacceptinggeneralid", email_address )
          base = "dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            entry.mailacceptinggeneralid.each do |entry_email_address|
              if email_address == entry_email_address
                result = {
                  email_address: email_address,
                  maildrop: entry.maildrop[0],
                  user_uid: entry.uid[0],
                  user_cn: entry.cn.join(' ')
                }
              end
            end
          end
          result
        end

      end
    end
  end
end
