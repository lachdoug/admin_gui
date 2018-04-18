class V0
  module Api
    module Controllers

      get '/library/:id' do
        Library.new( settings ).to_h.to_json
      end

    end
  end
end
