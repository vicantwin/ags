import { App } from "astal/gtk3";
import Bar from "./widget/Bar";
import style from "./style.scss";
import Applauncher from "./widget/modules/AppLauncher";

App.start({
	css: style,
	main() {
		App.get_monitors().map(Bar);
		Applauncher();
	},
});
