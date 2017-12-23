class V0
  module Api
    module Services
      class Ldap

        require 'net/ldap'

        class Net::LDAP::Connection
          MODIFY_OPERATIONS =
              { :add => 0,
                :delete => 1,
                :replace => 2,
                :increment => 3
              }
        end



        def users



          net_ldap do |ldap|
            net_ldap_users(ldap).map do |entry|
              {
                uid: entry.uid,
                name: entry.cn.join(' '),
              }
            end
          end
        end


        def create_user( data )

          net_ldap do |ldap|

            cn = "#{data[:first_name]} #{data[:last_name]}"
            dn = "cn=#{cn},ou=People,dc=engines,dc=internal"
            uidnumber = net_ldap_next_available_uidnumber ldap
            uid = data[:uid]
            email = "#{uid}@#{data[:domain]}"
            sasl = "????????????????"

            attr = {
              uidnumber: uidnumber,
              cn: cn,
              gidnumber: "5000",
              givenname: data[:first_name],
              homedirectory: "/home/users/#{uid}",
              loginshell: "/bin/sh",
              mailacceptinggeneralid: email,
              maildrop: email,
              objectclass: [
                "postfixUser",
                "posixAccount",
                "inetOrgPerson",
                "top" ],
              sn: data[:last_name],
              uid: uid,
              userpassword: "#{sasl}#{uid}@ENGINES.INTERNAL",
            }

            if ldap.add dn: dn, attributes: attr
              user_add_to_group( uid, "Users" )
              return {}
            else
              raise NonFatalError.new "Failed to create user.\n\n#{ldap.get_operation_result.message}", 405
            end

          end

        end

        def user(user_uid)
          ldap_user = nil
          groups = nil
          net_ldap do |ldap|
            ldap_user = net_ldap_find_user_by_uid ldap, user_uid
            ldap_user = ldap_user.to_enum.to_h
            # uid = ldap_user[:uid][0]
            groups = net_ldap_groups_for_user ldap, user_uid
          end
          puts ldap_user.inspect
          {
            name: ldap_user[:cn],
            # id: user_id,
            uid: user_uid,
            uidnumber: ldap_user[:uidnumber],
            groups: groups,
            email_addresses: [
              # "lachlan@engines.dev",
              # "support@engines.dev"
            ],
            distribution_lists: [
              # "Alerts",
              # "Newsletter"
            ]
          }
        end

        def user_available_groups(user_uid)
          user_groups - user_current_groups(user_uid)
        end

        def user_current_groups(user_uid)
          current_groups = nil
          net_ldap do |ldap|
            current_groups = net_ldap_groups_for_user ldap, user_uid
          end
          current_groups
        end

        def user_new_add_to_group( user_uid )
          {
            available_groups: user_available_groups(user_uid)
          }
        end

        def user_new_remove_from_group( user_uid )
          {
            current_groups: user_current_groups(user_uid)
          }
        end

        def user_add_to_group( user_uid, group_name )
          net_ldap do |ldap|
            ldap.modify(dn: "cn=#{group_name},ou=Groups,dc=engines,dc=internal", operations: [ [:add, :memberUid, user_uid ] ] )
          end
        end

        def user_remove_from_group( user_uid, group_name )
          net_ldap do |ldap|
            ldap.modify(dn: "cn=#{group_name},ou=Groups,dc=engines,dc=internal", operations: [ [:delete, :memberUid, user_uid ] ] )
          end
        end

        def user_groups
          net_ldap do |ldap|
            net_ldap_groups ldap
          end
        end

private



        def net_ldap

          auth = {
            :method => :simple,
            :username => "cn=admin,dc=engines,dc=internal",
            :password => "password"
          }

          Net::LDAP.open(:host => "ldap", :port => 389, :auth => auth) do |ldap|
            yield ldap
          end

        end

        def net_ldap_users(ldap)
          filter = Net::LDAP::Filter.eq( "objectclass", "posixAccount" )
          base = "ou=People,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter )
        end


        def net_ldap_next_available_uidnumber(ldap)
          uidnumber = nil
          loop do
            uidnumber = net_ldap_uidnumber ldap
            # byebug
            break unless net_ldap_uidnumber_in_use(ldap, uidnumber)
            net_ldap_increment_uidnumber(ldap)
          end
          uidnumber
        end

        def net_ldap_increment_uidnumber(ldap)
          ldap.modify(
            dn: "cn=uidNext,ou=System,ou=Engines,dc=engines,dc=internal",
            operations: [ [:increment, :uidNumber, '1' ] ] )
        end

        def net_ldap_uidnumber_in_use(ldap, uidnumber)
          ldap.search(
            filter: Net::LDAP::Filter.eq( "uidnumber", uidnumber ),
            base: "ou=People,dc=engines,dc=internal").any?
        end

        def net_ldap_uidnumber(ldap)
          result = nil
          ldap.search(
            base: "cn=uidNext,ou=System,ou=Engines,dc=engines,dc=internal",
            attributes: [ 'uidnumber' ] ) do |entry|
            entry.each do |k,v|
              result = v[0] if k == :uidnumber
            end
          end
          result
        end

        def net_ldap_email_domains(ldap)
          result = []
          ldap.search(
            base: "ou=domains,ou=email,ou=Services,ou=Containers,ou=Engines,dc=engines,dc=internal" ) do |entry|
            entry.each do |k,v|
              result << v[0] if k == :dc
            end
          end
          result
        end

        def net_ldap_find_entry_by_dn(ldap, dn)
          ldap.search( base: dn )[0]
        end

        def net_ldap_find_user_by_uid(ldap, uid)
          filter =
            Net::LDAP::Filter.eq( "objectclass", "posixAccount" ) &
            Net::LDAP::Filter.eq( "objectclass", "posixAccount" )
          base = "ou=People,dc=engines,dc=internal"
          ldap.search(:base => base, :filter => filter )[0]
        end

        def net_ldap_groups(ldap)
          result = []
          ldap.search(
            filter: Net::LDAP::Filter.eq( "objectClass", "posixGroup" ),
            base: "ou=Groups,dc=engines,dc=internal" ) do |entry|
            result << entry.cn[0]
          end
          result
        end

        def net_ldap_groups_for_user(ldap, uid)
          result = []
          ldap.search(
            filter: Net::LDAP::Filter.eq( "memberUid", uid ),
            base: "ou=Groups,dc=engines,dc=internal" ) do |entry|
            result << entry.cn[0]
          end
          result
        end


        # def new_user
        #   net_ldap do |ldap|
        #     domains = net_ldap_email_domains ldap
        #     {
        #       domains: domains
        #     }
        #   end
        # end

        # ldap.modify(dn: "cn=Users,ou=Groups,dc=engines,dc=internal", operations: [ [:replace, :cn, ['Users'] ] ] )


      end
    end
  end
end
