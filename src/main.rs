use whatsnext::{Whatsnext};
use chrono::{Local, NaiveDate};
use std::fs::File;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

fn main() -> Result<()> {
    let school = File::open("mvhs/school.yaml")?;
    let calendar = File::open("mvhs/schedule.yaml")?;

    let school: whatsnext::parse::PeriodsSchool = serde_yaml::from_reader(school)?;
    let calendar: whatsnext::parse::PeriodsCalendar = serde_yaml::from_reader(calendar)?;
    let whatsnext = Whatsnext::from_periods(&school, &calendar);

    //println!("Hello {}", Local::now());
    let date = NaiveDate::from_ymd(2021, 8, 16).and_hms(11, 10, 11);
    //let date = Local::now().naive_local();
    let schedule = whatsnext.day(&date.date());
    println!("{:#?}", schedule);

    let mut timeline = whatsnext.timeline(date);
    for _ in 0..20 {
        println!("{:?} {:?}", timeline.next().unwrap(), timeline.day().name());
    }

    Ok(())
}
