class V0
  module Api
    module Helpers

      def send_as_file( filename, contents )
        send_file(
          tempfile_for( contents ).path,
          type: "application/octet-stream",
          filename: filename )
      end

      def tempfile_for(content)
        file = Tempfile.new('engines_temp_file')
        file.write(content)
        file.rewind
        file.close
        file
      end

    end
  end
end
