class V0
  module Api
    module Services
      class Ldap

        def net_ldap_distribution_lists(ldap)
          result = []
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixGroup" )
          base = "ou=Distribution Groups,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            result << {
              name: entry.cn[0],
              description: entry.respond_to?(:description) ? entry.description[0] : ""
            }
          end
          result
        end

        def net_ldap_distribution_list(ldap, distribution_list_name)
          dn = "cn=#{distribution_list_name},ou=Distribution Groups,dc=engines,dc=internal"
          result = nil
          ldap.search(:base => dn ) do |entry|
            # byebug
            result = {
              name: entry.cn[0],
              description: entry.respond_to?(:description) ? entry.description[0] : "",
              email_addresses: entry.respond_to?(:memberuid) ? entry.memberuid : []
            }
          end
          result
        end

        def net_ldap_distribution_list_edit(ldap, distribution_list_name)
          dn = "cn=#{distribution_list_name},ou=Distribution Groups,dc=engines,dc=internal"
          result = nil
          ldap.search(:base => dn ) do |entry|
            # byebug
            local_part, domain = entry.cn[0].split('@')
            result = {
              local_part: local_part,
              domain: domain,
              description: entry.respond_to?(:description) ? entry.description[0] : "",
            }
          end
          result[:domains] = net_ldap_email_domains ldap
          result
        end

        def net_ldap_distribution_list_update(ldap, distribution_list_name, data)
          dn = "cn=#{distribution_list_name},ou=Distribution Groups,dc=engines,dc=internal"
          entry = net_ldap_find_entry_by_dn ldap, dn

          new_name = "#{data[:local_part]}@#{data[:domain]}"
          new_dn = "cn=#{new_name},ou=Distribution Groups,dc=engines,dc=internal"
          new_rdn = "cn=" + new_name

          if data[:description].length > 0
            if entry.respond_to?(:description)
              net_ldap_replace_attribute_value_on_entry ldap, entry, "description", data[:description]
            else
              net_ldap_add_attribute_value_to_entry ldap, entry, "description", data[:description]
            end
          end
          net_ldap_rename_entry_by_dn ldap, dn, new_rdn

          {
            name: new_name
          }
        end

        def net_ldap_create_email_distribution_list(ldap, data)

          cn = "#{data[:local_part]}@#{data[:domain]}"

          dn = "cn=#{cn},ou=Distribution Groups,dc=engines,dc=internal"
          gidnumber = net_ldap_next_available_gidnumber ldap

          attributes = {
            cn: cn,
            gidnumber: gidnumber,
            objectclass: [
              "posixGroup",
              "top" ],
          }
# byebug
          attributes.merge! description: data[:description] if data[:description].length > 0

          if ldap.add dn: dn, attributes: attributes
            return {
              name: cn,
            }
          else
            ldap_error ldap, "Failed to create distribution list."
          end

        end

      end
    end
  end
end
