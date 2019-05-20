class V0
  module Api
    module Controllers

      get '/system/container_events' do

        authenticate_user( skip_timeout_update: true )

        content_type "text/event-stream"
        response.headers['Connection'] = "keep-alive"

        stream(:keep_open) do |out|
          out.puts "retry: 900000\n\n" # set timeout to 15min ie 900000ms
          system.container_event_stream do |event|
            unless current_user.signin_timeout?
              begin
                out.puts "data: #{event.to_json}\n\n"
              rescue => e
                if out.closed?
                  puts "Webserver closed event stream"
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
