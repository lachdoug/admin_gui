class V0
  module Api
    module Helpers

      def self.legacy_input_definition_for(param)
        {
          "name": param[:name],
          "value": param[:value],
          "mandatory": param[:mandatory],
          "ask_at_build_time": param[:ask_at_build_time],
          "build_time_only": param[:build_time_only],
          "immutable": param[:immutable],
          "input": {
            "label": param[:label],
            "type": update_legacy_input_type_for( param[:field_type] ),
            "title": param[:tooltip],
            "comment": param[:comment],
            "hint": param[:hint],
            "placeholder": param[:placeholder],
            "collection": {
              "items": update_legacy_collection_for( param[:select_collection] ),
              "include_blank": false
            },
            "validation": {
              "pattern": param[:regex_validator],
              "message": param[:regex_invalid_message]
            }
          }
        }
      end

      def self.update_legacy_input_type_for(legacy_field_type)
        case legacy_field_type.to_s.to_sym
        when :boolean
          :checkbox
        when :collection, :select, :select_single
          :select
        when :int
          :integer
        when :hidden
          :hidden
        when :password
          :password
        when :password_with_confirmation
          :password_with_confirmation
        when :text, :text_area
          :text
        when :text_field
          :string
        else
          :string
        end
      end

      def self.update_legacy_collection_for(legacy_collection)
        JSON.parse( legacy_collection )
      rescue JSON::ParserError
        begin
          JSON.parse( "[" + legacy_collection + "]" )
        rescue JSON::ParserError
          []
        end
      end


    end
  end
end
