class V0
  module Api
    module Controllers

      get '/system/container_events' do

# random = Random.new()
# p :random
# p random
        content_type "text/event-stream"
        user = current_user
        stream do |out|
          system.container_event_stream do |event|
            # p :random
            # p random
            if user.within_timeout?
              begin
                out.puts "data: #{event.to_json}\n\n"
              rescue => e
                # p :close_random
                # p random
                break if out.closed?
                raise e
              end
            else
              out.close
              puts "Timeout event stream"
              break
            end
          end
        end
      end

    end
  end
end
