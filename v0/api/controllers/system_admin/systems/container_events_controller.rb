class V0
  module Api
    module Controllers

      get '/system/container_events' do
        authenticate_user( skip_timeout_update: true )
        content_type "text/event-stream"
        stream(:keep_open) do |out|
          system.container_event_stream do |event|
            unless current_user.signin_timeout?
              begin
                out.puts "data: #{event.to_json}\n\n"
              rescue => e
                if out.closed?
                  puts "Client closed event stream"
                  break
                else
                  raise e
                end
              end
            else
              out.puts "data: #{ { type: :timeout }.to_json }\n\n"
              out.close
              puts "Event stream closed due to user timeout."
              break
            end
          end

        end
      end

    end
  end
end
