class V0
  module Api
    module Services
      class Ldap

        def net_ldap_find_entry_by_dn(ldap, dn)
          search_result = ldap.search( base: dn )
          search_result[0] if search_result
        end

        def net_ldap_delete_entry_by_dn(ldap, dn)
          if ldap.delete dn: dn
            return {}
          else
            ldap_error ldap, "Failed to delete entry."
          end
        end

        def net_ldap_add_class_to_entry( ldap, entry, klass )
          unless entry.objectClass.include? klass
            unless ldap.modify(
              dn: entry.dn,
              operations: [ [:add, :objectClass, klass ] ]
            )
              ldap_error ldap, "Failed to add class '#{klass}'."
            end
          end
        end

        def net_ldap_remove_class_from_entry( ldap, entry, klass )
          if entry.objectClass.include? klass
            unless ldap.modify(
              dn: entry.dn,
              operations: [ [:delete, :objectClass, klass ] ]
            )
              ldap_error ldap, "Failed to add class '#{klass}'."
            end
          end
        end

        def net_ldap_rename_entry_by_dn( ldap, dn, newrdn )
          if ldap.rename({
              olddn: dn,
              newrdn: newrdn,
              delete_attributes: true
            })
          else
            ldap_error ldap, "Failed to rename to '#{newrdn}'."
          end
        end

        def net_ldap_add_attribute_value_to_entry( ldap, entry, attribute, value )
          if entry.respond_to? attribute
            result = ldap.modify(dn: entry.dn, operations: [ [:add, attribute, value ] ] )
          else
            result = ldap.add_attribute( entry.dn, attribute, value )
          end
          ldap_error ldap, "Failed to add value '#{value}' to attribute '#{attribute}'." unless result
        end

        def net_ldap_delete_attribute_value_from_entry( ldap, entry, attribute, value )
          result = ldap.modify(dn: entry.dn, operations: [ [:delete, attribute, value ] ] )
          ldap_error ldap, "Failed to add value '#{value}' to attribute '#{attribute}'." unless result
        end

        def net_ldap_delete_attribute_from_entry( ldap, entry, attribute )
          if ldap.modify(dn: entry.dn, operations: [ [:delete, attribute, nil ] ] )
            {}
          else
            ldap_error ldap, "Failed to remove attribute '#{attribute}'."
          end
        end

        def net_ldap_replace_attribute_value_on_entry( ldap, entry, attribute, value )
          if ldap.modify(dn: entry.dn, operations: [ [:replace, attribute, value ] ] )
            {}
          else
            ldap_error ldap, "Failed to update attribute '#{attribute}'."
          end
        end


      end
    end
  end
end
