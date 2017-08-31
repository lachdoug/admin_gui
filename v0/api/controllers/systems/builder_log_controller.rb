class V0
  module Api
    module Controllers

      get '/system/builder_log_events' do
        content_type "text/event-stream"
        stream do |out|
          system.builder_log_event_stream do |event|
            out.puts "data: #{event.to_json}\n\n"
          end
        end
      end

    end
  end
end
