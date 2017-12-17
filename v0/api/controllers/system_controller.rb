class V0
  module Api
    module Controllers

      get '/system' do
        # byebug
        system.to_json
          # include_software_titles: show_software_titles,
                        # include_services: show_services
      end

    end
  end
end
