class V0
  module Api
    module Controllers

      get '/system/builder_log_events' do
        authenticate_user( skip_timeout_update: true )
        content_type "text/event-stream"
        stream(:keep_open) do |out|
          system.builder_log_event_stream do |event|
            begin
              out.puts "data: #{event.to_json}\n\n"
            rescue => e
              if out.closed?
                puts "Client closed builder log stream"
                break
              else
                raise e
              end
            end
          end
        end
      end

    end
  end
end
