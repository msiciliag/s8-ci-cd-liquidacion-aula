#!/usr/bin/env bash
# Ejecutar desde la raíz del repo con npm ci completado. Cada runner produce un archivo.
set -euo pipefail
mkdir -p entrega
case "${1:?Indica android, windows, macos o ios}" in
  android)
    : "${ANDROID_HOME:?Falta el Android SDK}"
    sdkmanager "platforms;android-36" "build-tools;36.0.0" "ndk;28.2.13676358"
    export NDK_HOME="$ANDROID_HOME/ndk/28.2.13676358"
    rustup target add aarch64-linux-android
    npm run tauri -- android init --ci --skip-targets-install
    # Un release incluye los recursos web en el APK. Gradle lo produce sin firmar.
    npm run tauri -- android build --ci --apk --target aarch64
    apk=$(find src-tauri/gen/android/app/build/outputs/apk -name '*-unsigned.apk' -print -quit)
    test -s "$apk"
    # Firma efímera de aula. La clave solo vive en este runner y nunca se sube.
    keydir=$(mktemp -d)
    trap 'rm -f "$keydir/aula.jks"; rmdir "$keydir"' EXIT
    pass=$(openssl rand -hex 16)
    export AULA_KEY_PASS="$pass"
    keytool -genkeypair -noprompt -alias aula -keyalg RSA -keysize 2048 -validity 3650 -dname 'CN=Ensayo local' -storetype JKS -keystore "$keydir/aula.jks" -storepass:env AULA_KEY_PASS -keypass:env AULA_KEY_PASS
    signer="$ANDROID_HOME/build-tools/36.0.0/apksigner"
    "$signer" sign --ks "$keydir/aula.jks" --ks-pass env:AULA_KEY_PASS --key-pass env:AULA_KEY_PASS --v4-signing-enabled false --out entrega/liquidacion-android-arm64.apk "$apk"
    "$signer" verify --verbose entrega/liquidacion-android-arm64.apk
    unzip -l entrega/liquidacion-android-arm64.apk | grep 'lib/arm64-v8a/' > /dev/null
    ;;
  windows)
    npm run tauri -- build --ci --bundles nsis
    files=(src-tauri/target/release/bundle/nsis/*.exe)
    test "${#files[@]}" -eq 1 && test -s "${files[0]}"
    cp "${files[0]}" entrega/liquidacion-windows-x64.exe
    ;;
  macos)
    npm run tauri -- build --ci --bundles app
    apps=(src-tauri/target/release/bundle/macos/*.app)
    test "${#apps[@]}" -eq 1 && test -d "${apps[0]}"
    # Sella el bundle con identidad ad hoc local, sin cuenta de desarrollador.
    codesign --force --sign - --timestamp=none "${apps[0]}"
    codesign --verify --strict "${apps[0]}"
    tar -C "$(dirname "${apps[0]}")" -czf entrega/liquidacion-macos-arm64.app.tar.gz "$(basename "${apps[0]}")"
    ;;
  ios)
    rustup target add aarch64-apple-ios-sim
    npm run tauri -- ios init --ci --skip-targets-install
    npm run tauri -- ios build --ci --target aarch64-sim --no-sign --archive-only
    app=$(find src-tauri/gen/apple -type d -path '*.xcarchive/Products/Applications/*.app' -print -quit)
    test -n "$app"
    platform=$(/usr/libexec/PlistBuddy -c 'Print :DTPlatformName' "$app/Info.plist")
    test "$platform" = iphonesimulator
    tar -C "$(dirname "$app")" -czf entrega/liquidacion-ios-simulador-arm64.app.tar.gz "$(basename "$app")"
    ;;
  *) echo 'Plataforma desconocida' >&2; exit 2 ;;
esac
