import javax.servlet.ServletContext
import gitbucket.core.plugin.PluginRegistry
import gitbucket.core.service.SystemSettingsService.SystemSettings
import io.github.gitbucket.solidbase.model.Version

class Plugin extends gitbucket.core.plugin.Plugin {
  override val pluginId: String = "popovers"
  override val pluginName: String = "Popovers Plugin"
  override val description: String = "Show popover preview on links to issues and pull requests"
  override val versions: List[Version] = List(
    new Version("1.0.0"),
    new Version("1.1.0")
  )

  override val assetsMappings = Seq(
    "/popovers" -> "/assets"
  )

  override def javaScripts(registry: PluginRegistry, context: ServletContext, settings: SystemSettings): Seq[(String, String)] = {
    val basePath = settings.baseUrl.getOrElse(context.getContextPath)
    val assetsPath = basePath + "/plugin-assets/popovers"
    Seq(".*" -> s"""
      |const _popoversBasePath = "${basePath}";
      |</script>
      |<script src="${assetsPath}/main.js" defer>
      |""".stripMargin)
  }
}
