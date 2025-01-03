{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    ags.url = "github:aylur/ags";
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    agsPackages = with ags.packages.${system}; [
      apps
      bluetooth
      hyprland
      mpris
      notifd
      powerprofiles
      battery
      wireplumber
      network
      tray
    ];
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [
        # includes astal3 astal4 astal-io by default
        (ags.packages.${system}.default.override {extraPackages = agsPackages;})
        (with pkgs; [alejandra dart-sass])
      ];
    };

    packages.${system}.default = ags.lib.bundle {
      inherit pkgs;
      src = ./.;
      name = "vastal"; # name of executable
      entry = "app.ts";

      extraPackages = with pkgs; [];
    };
  };
}
