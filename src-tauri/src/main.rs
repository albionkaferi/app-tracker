// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod track;
use std::thread;
use track::track_processes;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, Manager};

use lazy_static::lazy_static;


/*
* data is the hash map that stores the data for the processes we will regulate
* key: process name
* value: array of values [previous run time, current run time, allowed run time]
*/
lazy_static! {
    static ref DATA: Arc<Mutex<HashMap<String, [u64; 3]>>> = Arc::new(Mutex::new(HashMap::new()));
}

#[tauri::command]
fn add_app(app: tauri::AppHandle, name: &str, allowed_time: u64) -> String {
    let mut data = DATA.lock().unwrap();
    if data.contains_key(name) { return format!("Error: {} is already added.", name) }
    data.insert(String::from(name), [0, 0, allowed_time]);
    let array: Vec<(String, [u64; 3])> = data.clone().into_iter().collect();
    let _ = app.emit_all("changed", array);
    return format!("Success: {} added.", name);
}

#[tauri::command]
fn remove_app(app: tauri::AppHandle, name: &str) -> String {
    let mut data = DATA.lock().unwrap();
    data.remove(name);
    let array: Vec<(String, [u64; 3])> = data.clone().into_iter().collect();
    let _ = app.emit_all("changed", array);
    return format!("Success: {} removed.", name);
}

#[tauri::command]
fn edit_app(app: tauri::AppHandle, name: &str, allowed_time: u64) -> (String, u64) {
    let mut data = DATA.lock().unwrap();
    let time_array = match data.get_mut(name) {
        Some(array) => array,
        None => return (format!("Error: internal error."), 0)
    };
    let total = time_array[0] + time_array[1];
    if allowed_time <= total {
        return (format!("Error: new time must be greater than current usage time"), total)
    } 
    time_array[2] = allowed_time;
    let array: Vec<(String, [u64; 3])> = data.clone().into_iter().collect();
    let _ = app.emit_all("changed", array);
    return (format!("Success: allowed time for {} updated", name), allowed_time)
}

#[tauri::command]
fn retrieve_data() -> Vec<(String, [u64; 3])> {
    let data = DATA.lock().unwrap();
    let array: Vec<(String, [u64; 3])> = data.clone().into_iter().collect();
    return array;
}


fn main() {
    
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(open)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);
    
    tauri::Builder::default()
    .setup(move |app| {
        let app_handle = app.app_handle();
        let data_clone = Arc::clone(&DATA);
        let app_handle_clone = app_handle.clone();
        thread::spawn(move || {
            track_processes(data_clone, app_handle_clone);
        });
        Ok(())
    })
    .on_window_event(|event| match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
          event.window().hide().unwrap();
          api.prevent_close();
        }
        _ => {}
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                "open" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                },
                "quit" => {
                    std::process::exit(0);
                },
                _ => {}
            }
        }
        _ => {}
    })
    .invoke_handler(tauri::generate_handler![add_app, remove_app, edit_app, retrieve_data])
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|_app_handle, event| match event {
        tauri::RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        _ => {}
    });

}
