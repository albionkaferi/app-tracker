use sysinfo::{System, SystemExt, ProcessExt};
use std::collections::HashMap;
use std::collections::HashSet;
use std::time::Duration;
use std::thread;

fn main() {

    /*
    * data is our hash map for storing which application to regulate
    * key: application name
    * value: array of times representing [past run time, current run time, allowed run time]
    */
    let mut data = HashMap::new();
    /*
    * visited is a hash set to keep track of visited processes when iterating through the list of processes
    * this prevents duplicate operations for processes with the same name
    */
    let mut visited = HashSet::new();
    /*
    * open is a hash set that keeps track of which processes that we are regulating are open
    * different from visited in that this does not get cleared after each iteration
    * used to check when a program is closed
    */
    let mut open = HashSet::new();

    
    data.insert(String::from("mspaint.exe"), [0, 0, 90]);
    
    let mut sys = System::new_all();

    loop {

        sys.refresh_all();

        for (pid, process) in sys.processes() {
            if data.contains_key(process.name()) && !visited.contains(process.name()) {

                let time_array = match data.get_mut(process.name()) {
                    Some(array) => array,
                    None => continue
                };
                let allowed_time = time_array[2];
                time_array[1] = process.run_time();
                let curr_time = time_array[1];
                let past_time = time_array[0];

                if past_time + curr_time > allowed_time {
                    process.kill();
                } else {
                    println!("PID: {} Name: {} Past Time {} Current Time: {} Allowed Time: {}", pid, process.name(), past_time, curr_time, allowed_time);
                    visited.insert(process.name().to_owned());
                    open.insert(process.name().to_owned());
                }
            }
        }

        // handle closing an application
        let open_clone = open.clone();
        for process in &open_clone {
            if !visited.contains(process) {
                let time_array = match data.get_mut(process) {
                    Some(array) => array,
                    None => continue
                };

                time_array[0] += time_array[1];
                time_array[1] = 0;
                open.remove(process);
            }
        }

        visited.clear();
        thread::sleep(Duration::from_secs(1));
    }
}