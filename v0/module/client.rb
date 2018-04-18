class V0

  def self.client_package
    return client_files if Sinatra::Base.development?
    File.read "#{root}/../data/v0/client.js"
  end

  def self.client_files
    Dir.glob( [ "#{root}/client/**/*.js" ] ).map do |file|
      File.read file
    end.join("\n")
  end

  File.write "#{root}/../data/v0/client.js", client_files ## TODO: minify this

end
