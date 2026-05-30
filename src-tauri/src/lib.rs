use tauri::Manager;
use tauri_plugin_shell::ShellExt;

struct BackendProcess(std::sync::Mutex<Option<tauri_plugin_shell::process::CommandChild>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Get the app's install directory to use as working dir for the backend
            let resource_dir = app
                .path()
                .resource_dir()
                .expect("failed to get resource dir");

            // Spawn the .NET backend as a sidecar process
            let sidecar = app
                .shell()
                .sidecar("fintrack-api")
                .expect("failed to create sidecar command")
                .current_dir(resource_dir);

            let (_rx, child) = sidecar.spawn().expect("failed to spawn backend");

            // Store the child process so we can kill it on exit
            app.manage(BackendProcess(std::sync::Mutex::new(Some(child))));

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if let tauri::RunEvent::Exit = event {
            if let Some(state) = app_handle.try_state::<BackendProcess>() {
                if let Ok(mut guard) = state.0.lock() {
                    if let Some(child) = guard.take() {
                        let _ = child.kill();
                    }
                }
            }
        }
    });
}
