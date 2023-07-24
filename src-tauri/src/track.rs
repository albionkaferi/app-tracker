use sysinfo::{System, SystemExt, ProcessExt};
use std::collections::HashMap;
use std::collections::HashSet;
use std::time::Duration;
use std::thread;
use std::sync::{Arc, Mutex};

pub fn track_processes(data: Arc<Mutex<HashMap<String, [u64; 3]>>>) {
    /* 
    * visited is used to keep track of which processes are visited when iterating through the list of processes
    * this prevents duplicate operations for processes with the same name
    */
    let mut visited = HashSet::new();
    /*
    * open is used to keep track of which processes are open
    * different from visited in that this does not get cleared after each iteration
    * used to check if a previously opened process process is still running
    */
    let mut open = HashSet::new();
    
    let mut sys = System::new_all();

    loop {

        sys.refresh_all();
        
        // iterate through all the processes
        for (pid, process) in sys.processes() {
            // lock access to the hash map and unwrap it
            let mut data = data.lock().unwrap();
            // if the process is one we want to track and it hasn't been visited already
            if data.contains_key(process.name()) && !visited.contains(process.name()) {

                let time_array = match data.get_mut(process.name()) {
                    Some(array) => array,
                    None => continue
                };
                let allowed_time = time_array[2];
                time_array[1] = process.run_time();
                let curr_time = time_array[1];
                let past_time = time_array[0];
                // end the process if its total time is greater than its allowed time
                if past_time + curr_time > allowed_time {
                    process.kill();
                } else {
                    println!("PID: {} | Name: {} | Past Time {} | Current Time: {} | Allowed Time: {}", pid, process.name(), past_time, curr_time, allowed_time);
                    visited.insert(process.name().to_owned());
                    open.insert(process.name().to_owned());
                }
            }
        }

        // handle closing an application
        let open_clone = open.clone();
        for process in &open_clone {
            if !visited.contains(process) {
                // lock access to the hash map and unwrap it
                let mut data = data.lock().unwrap();
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