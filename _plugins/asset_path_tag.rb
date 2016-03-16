module Jekyll
  class AssetPathTag < Liquid::Tag
    @markup = nil

    def initialize(tag_name, markup, tokens)
      #strip leading and trailing spaces
      @markup = markup.strip
      super
    end

    def render(context)
      if @markup.empty?
        return "Error processing input, expected syntax: {% asset_path [filename] %}"
      end

      #render the markup
      rawFilename = Liquid::Template.parse(@markup).render context

      #strip leading and trailing quotes
      filename = rawFilename.gsub(/^("|')|("|')$/, '')

      #fix double slashes
      "#{context.registers[:site].config['baseurl']}/assets/#{filename}".gsub(/\/{2,}/, '/')
    end
  end
end

Liquid::Template.register_tag('asset_path', Jekyll::AssetPathTag)
