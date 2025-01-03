import Battery from "gi://AstalBattery";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Network from "gi://AstalNetwork";
import Wp from "gi://AstalWp";
import { GLib, Variable, bind } from "astal";
import { Astal, type Gdk, Gtk } from "astal/gtk3";
import { truncateString } from "../utils";
import { SysTray } from "./SysTray";

function Wifi() {
	const { wifi } = Network.get_default();

	return (
		<box className="Wifi rounded-border">
			<icon icon={bind(wifi, "iconName")} />
			<label label={bind(wifi, "ssid").as(String)} />
		</box>
	);
}

function AudioSlider() {
	const speaker = Wp.get_default()?.audio.defaultSpeaker!;

	return (
		<box className="AudioSlider rounded-border">
			<icon icon={bind(speaker, "volumeIcon")} />
			<label
				label={bind(speaker, "volume").as((p) =>
					p !== 0 ? `${Math.floor(p * 100)}%` : "X",
				)}
			/>
		</box>
	);
}

function BatteryLevel() {
	const bat = Battery.get_default();

	return (
		<box className="Battery rounded-border" visible={bind(bat, "isPresent")}>
			<icon icon={bind(bat, "batteryIconName")} />
			<label
				label={bind(bat, "percentage").as((p) => `${Math.floor(p * 100)}%`)}
			/>
		</box>
	);
}

function Media() {
	const mpris = Mpris.get_default();

	return (
		<box className="Media rounded-border">
			{bind(mpris, "players").as((ps) =>
				ps[0] ? (
					<box>
						<box
							className="Cover"
							valign={Gtk.Align.CENTER}
							css={bind(ps[0], "coverArt").as(
								(cover) => `background-image: url('${cover}');`,
							)}
						/>
						<label
							label={bind(ps[0], "title").as(() =>
								truncateString(`${ps[0].title} - ${ps[0].artist}`, 40),
							)}
						/>
					</box>
				) : (
					""
				),
			)}
		</box>
	);
}

function Workspaces() {
	const hypr = Hyprland.get_default();

	return (
		<box className="Workspaces rounded-border">
			{bind(hypr, "workspaces").as((wss) =>
				wss
					.sort((a, b) => a.id - b.id)
					.map((ws) => (
						<button
							className={bind(hypr, "focusedWorkspace").as((fw) =>
								ws === fw ? "focused" : "",
							)}
							onClicked={() => ws.focus()}
						>
							{ws.id}
						</button>
					)),
			)}
		</box>
	);
}

function FocusedClient() {
	const hypr = Hyprland.get_default();
	const focused = bind(hypr, "focusedClient");

	return (
		<box className="FocusedClient rounded-border" visible={focused.as(Boolean)}>
			{focused.as((client) => {
				const title = bind(client, "title").as(String).get();

				return client && <label label={truncateString(title, 40)} />;
			})}
		</box>
	);
}

function Time({ format = "%I:%M %p - %A%e" }) {
	const time = Variable<string>("").poll(
		1000,
		() => GLib.DateTime.new_now_local().format(format)!,
	);

	return (
		<label
			className="Time rounded-border"
			onDestroy={() => time.drop()}
			label={time()}
		/>
	);
}

export default function Bar(monitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			className="Bar"
			gdkmonitor={monitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
		>
			<centerbox>
				<box hexpand halign={Gtk.Align.START}>
					<Workspaces />
					<FocusedClient />
				</box>
				<box>
					<Media />
				</box>
				<box hexpand halign={Gtk.Align.END}>
					<SysTray />
					<AudioSlider />
					<BatteryLevel />
					<Wifi />
					<Time />
				</box>
			</centerbox>
		</window>
	);
}
