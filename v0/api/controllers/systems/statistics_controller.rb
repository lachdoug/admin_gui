class V0
  module Api
    module Controllers

      get '/system/statistics' do
        system.statistics.to_json
      end

      get '/system/statistics/container_memory' do
        # do auth such that polling to this route does not reset timeout
        user = current_user( skip_timeout: true )
        raise NonFatalError.new "Signed out due to inactivity.", 401 unless user.within_timeout?
        system.container_memory_statistics.to_json
      end

    end
  end
end
