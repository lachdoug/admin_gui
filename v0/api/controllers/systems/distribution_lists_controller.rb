class V0
  module Api
    module Controllers

      get '/system/email/distribution_lists' do
        system.distribution_lists.to_json
      end

      get '/system/email/distribution_lists/new' do
        system.distribution_lists_new.to_json
      end

      post '/system/email/distribution_lists' do
        system.distribution_lists_create.to_json
      end


    end
  end
end
