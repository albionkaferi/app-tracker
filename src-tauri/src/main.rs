// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod track;
use std::thread;
use track::track_processes;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

use lazy_static::lazy_static;


/*
* data is the hash map that stores the data for the processes we will regulate
* key: process name
* value: array of values [previous run time, current run time, allowed run time]
*/
lazy_static! {
    static ref DATA: Arc<Mutex<HashMap<String, [u64; 3]>>> = Arc::new(Mutex::new(HashMap::new()));
}

#[tauri::command(rename_all = "snake_case")]
fn add_app(name: &str, allowed_time: u64) -> String {
    let mut data = DATA.lock().unwrap();
    if data.contains_key(name) { return format!("Error: {} is already added.", name) }
    data.insert(String::from(name), [0, 0, allowed_time]);
    return format!("Success: {} added.", name);
}

#[tauri::command(rename_all = "snake_case")]
fn remove_app(name: &str) -> String {
    let mut data = DATA.lock().unwrap();
    data.remove(name);
    return format!("Success: {} removed.", name);
}

#[tauri::command(rename_all = "snake_case")]
fn retrieve_data() -> Vec<(String, [u64; 3])> {
    let data = DATA.lock().unwrap();
    let array: Vec<(String, [u64; 3])> = data.clone().into_iter().collect();
    return array;
}


fn main() {

    // create a clone of the hash map and create a new thread that runs the tracking loop
    let data_clone = Arc::clone(&DATA);
    thread::spawn(move || {
        track_processes(data_clone);
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_app, remove_app, retrieve_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
