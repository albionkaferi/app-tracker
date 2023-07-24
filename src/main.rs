use sysinfo::{System, SystemExt, ProcessExt};
use std::collections::HashMap;
use std::collections::HashSet;

fn main() {

    let mut data = HashMap::new();
    let mut visited = HashSet::new();
    data.insert(String::from("Discord.exe"), vec![5000, 1000]);

    let mut sys = System::new_all();

    sys.refresh_all();

    for (pid, process) in sys.processes() {
        if data.contains_key(process.name()) && !visited.contains(process.name()) {

            let time_vector = match data.get_mut(process.name()) {
                Some(vector) => vector,
                None => continue
            };
            let allowed_time = time_vector[0];
            time_vector[1] += process.run_time();
            let total_time = time_vector[1];

            println!("PID: {} Name: {} Allowed Time: {} Total Time: {}", pid, process.name(), allowed_time, total_time);
            visited.insert(process.name());
        }
    }

    visited.clear();
}