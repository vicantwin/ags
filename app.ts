import { App } from "astal/gtk3";
import { exec } from "astal/process";
import Bar from "./widget/Bar";
import Applauncher from "./widget/modules/AppLauncher";

exec(["sass", "./style.scss", "/tmp/style.css"]);

App.start({
	css: "/tmp/style.css",
	main() {
		App.get_monitors().map(Bar);
		Applauncher();
	},
});
