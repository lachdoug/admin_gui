class V0
  module Api
    module Services
      class Ldap

        def net_ldap_create_user(ldap, data)

          cn = "#{data[:first_name]} #{data[:last_name]}"
          dn = "cn=#{cn},ou=People,dc=engines,dc=internal"
          uidnumber = net_ldap_next_available_uidnumber ldap
          uid = data[:uid]

          attributes = {
            uidnumber: uidnumber,
            cn: cn,
            gidnumber: "5000",
            givenname: data[:first_name],
            homedirectory: "/home/users/#{uid}",
            loginshell: "/bin/sh",
            # mailacceptinggeneralid: [],
            # maildrop: email,
            objectclass: [
              # "postfixUser",
              "posixAccount",
              "inetOrgPerson",
              "top" ],
            sn: data[:last_name],
            uid: uid,
            userpassword: "{SASL}#{uid}@ENGINES.INTERNAL",
          }

          if ldap.add dn: dn, attributes: attributes
            user_add_to_group( uid, "Users" )
            return {
              uid: uid,
              name: cn,
            }
          else
            ldap_error ldap, "Failed to create user."
          end

        end

        def net_ldap_users(ldap)
          result = []
          filter = Net::LDAP::Filter.eq( "objectclass", "posixAccount" )
          base = "ou=People,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter ) do |entry|
            result << {
              uid: entry.uid[0],
              name: entry.cn.join(' '),
            }
          end
          result
        end

        def net_ldap_find_user_by_uid(ldap, uid)
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
            Net::LDAP::Filter.eq( "uid", uid )
          base = "ou=People,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter )[0]
        end

      end
    end
  end
end
