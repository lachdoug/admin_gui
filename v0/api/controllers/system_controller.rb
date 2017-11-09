class V0
  module Api
    module Controllers

      get '/system' do
        # byebug
        system.to_json  include_software_titles: show_software_titles,
                        include_services: show_services
      end

      post '/system/signin' do
        @user = User.new( session, settings )
        @user.sign_in( system( without_token: true ), params[:data] )
        { username: @user.username }.to_json
      end

      delete '/system/signin' do
         current_user.sign_out.to_json if current_user
         {}.to_json
      end

    end
  end
end
