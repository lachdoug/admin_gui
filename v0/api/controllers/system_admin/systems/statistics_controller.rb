class V0
  module Api
    module Controllers

      get '/system/statistics/summary' do
        system.summary_statistics.to_json
      end

      get '/system/statistics' do
        system.statistics.to_json
      end

      get '/system/statistics/container_memory' do
        # do auth such that polling to this route does not reset timeout
        authenticate_user( skip_timeout_update: true )
        raise NonFatalError.new "Signed out due to inactivity.", 401 if current_user.signin_timeout?
        system.container_memory_statistics.to_json
      end

    end
  end
end
