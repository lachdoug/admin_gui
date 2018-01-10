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

        ########################################################################
        ## Users
        ########################################################################

        def users
          net_ldap do |ldap|
            net_ldap_users(ldap)
          end
        end

        def create_user( data )
          net_ldap do |ldap|
            net_ldap_create_user ldap, data
          end
        end

        def user(user_uid)
          ldap_user = nil
          user_cn = nil
          uidnumber = nil
          email_addresses = nil
          distribution_lists = nil
          groups = nil
          net_ldap do |ldap|
            ldap_user = net_ldap_find_user_by_uid ldap, user_uid
            user_cn = ldap_user.cn.join(' ')
            uidnumber = ldap_user.uidnumber[0]
            groups = net_ldap_groups_for_user ldap, user_uid
            email_addresses = ldap_user.respond_to?('mailacceptinggeneralid') ? ldap_user.mailacceptinggeneralid : []
            distribution_lists = net_ldap_distribution_lists_for_user ldap, user_uid
          end
          puts ldap_user.inspect
          {
            name: user_cn,
            # id: user_id,
            uid: user_uid,
            uidnumber: uidnumber,
            groups: groups,
            email_addresses: email_addresses,
            distribution_lists: distribution_lists
          }
        end

        ########################################################################
        ## User - User groups
        ########################################################################

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
            net_ldap_user_add_to_group ldap, user_uid, group_name
          end
        end

        def user_remove_from_group( user_uid, group_name )
          net_ldap do |ldap|
            net_ldap_user_remove_from_group ldap, user_uid, group_name
          end
        end

        ########################################################################
        ## User - Email addresses
        ########################################################################

        def user_new_add_email_address( user_uid )
          result = {}
          net_ldap do |ldap|
            result[:available_domains] = net_ldap_email_domains ldap
            # byebug
          end
          result
        end

        def user_new_remove_email_address( user_uid )
          result = {}
          net_ldap do |ldap|
            result[:email_addresses] = net_ldap_user_email_addresses ldap, user_uid
          end
          result
        end

        def user_add_email_address( user_uid, email_address )
          net_ldap do |ldap|
            net_ldap_user_add_email_address ldap, user_uid, email_address
          end
        end

        def user_remove_email_address( user_uid, email_address )
          net_ldap do |ldap|
            net_ldap_user_remove_email_address ldap, user_uid, email_address
          end
        end

        ########################################################################
        ## User groups
        ########################################################################

        def user_groups
          net_ldap do |ldap|
            net_ldap_groups ldap
          end
        end

        ########################################################################
        ## Email domains
        ########################################################################

        def email_domains
          net_ldap do |ldap|
            net_ldap_email_domains ldap
          end
        end

        def create_email_domain( email_domain )
          net_ldap do |ldap|
            net_ldap_create_email_domain ldap, email_domain
          end
          { email_domain: email_domain }
        end

        ########################################################################
        ## Email addresses
        ########################################################################

        def email_addresses
          net_ldap do |ldap|
            net_ldap_email_addresses ldap
          end
        end

        def email_address(email_address)
          net_ldap do |ldap|
            net_ldap_email_address ldap, email_address
          end
        end

        ########################################################################
        ## Distribution lists
        ########################################################################

        def distribution_lists
          net_ldap do |ldap|
            net_ldap_distribution_lists ldap
          end
        end

        def distribution_list(distribution_list)
          net_ldap do |ldap|
            net_ldap_distribution_list ldap, distribution_list
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



        # def new_user
        #   net_ldap do |ldap|
        #     domains = net_ldap_email_domains ldap
        #     {
        #       domains: domains
        #     }
        #   end
        # end

        # ldap.modify(dn: "cn=Users,ou=Groups,dc=engines,dc=internal", operations: [ [:replace, :cn, ['Users'] ] ] )






        #<Net::LDAP::Entry:0x00000002d1acc0
       #  @myhash={
       #    :dn=>["cn=a a,ou=People,dc=engines,dc=internal"],
       #    :cn=>["a a"],
       #    :givenname=>["a"],
       #    :homedirectory=>["/home/users/25019"],
       #    :loginshell=>["/bin/sh"],
       #    :mailacceptinggeneralid=>["25019@"],
       #    :maildrop=>["25019@"],
       #    :objectclass=>["postfixUser", "posixAccount", "inetOrgPerson", "top"],
       #    :sn=>["a"],
       #    :uid=>["25019"],
       #    :userpassword=>["password"],
       #    :uidnumber=>["25000"],
       #    :gidnumber=>["5000"]}>


      end
    end
  end
end
