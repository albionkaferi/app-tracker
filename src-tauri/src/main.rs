// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod track;
use std::thread;
use track::track_processes;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    /*
    * data is the hash map that stores the data for the processes we will regulate
    * key: process name
    * value: array of values [previous run time, current run time, allowed run time]
    */
    let data = Arc::new(Mutex::new(HashMap::new()));

    // lock the hash map, unwrap, and insert <- this is for testing; will be removed later
    data.lock().unwrap().insert(String::from("mspaint.exe"), [0, 0, 90]);

    // create a clone of the hash map and create a new thread that runs the tracking loop
    let data_clone = Arc::clone(&data);
    thread::spawn(move || {
        track_processes(data_clone);
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
