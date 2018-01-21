class V0
  module Api
    module Services
      class Ldap

        def net_ldap_user(ldap, user_uid)
          ldap_user = net_ldap_find_user_by_uid ldap, user_uid
          user_cn = ldap_user.cn[0]
          first_name = ldap_user.givenname[0]
          last_name = ldap_user.sn[0]
          uidnumber = ldap_user.uidnumber[0]
          groups = net_ldap_groups_for_user ldap, user_uid
          email_user = ldap_user.objectClass.include? "postfixUser"
          mailbox = email_user ? net_ldap_user_mailbox( ldap, user_uid ) : ""
          email_aliases = email_user ? net_ldap_user_email_addresses( ldap, user_uid ) : []
          distribution_lists = email_user ? net_ldap_distribution_lists_for_user(ldap, user_uid) : []
          {
            name: user_cn,
            first_name: first_name,
            last_name: last_name,
            uid: user_uid,
            uidnumber: uidnumber,
            groups: groups,
            email_user: email_user,
            mailbox: mailbox,
            email_aliases: email_aliases,
            distribution_lists: distribution_lists
          }
        end

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
