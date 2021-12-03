use chrono::{Duration, Local, NaiveDate, NaiveDateTime, NaiveTime};
use console::{Style, Term};
use futures::try_join;
use hhmmss::Hhmmss;
use serde::Deserialize;
use std::fmt;
use structopt::StructOpt;
use whatsnext::parse::{PeriodsCalendar, PeriodsSchool, SchoolEntry};
use whatsnext::Whatsnext;

#[derive(StructOpt)]
struct Cli {
    /// the date
    date: Option<NaiveDateTime>,

    /// seconds per second during playback
    #[structopt(short = "r", long = "rate", default_value = "1")]
    time_multiplier: i32,

    /// print the schedule for `date`
    #[structopt(long)]
    schedule: bool,

    /// id of periods.io school
    #[structopt(long, default_value = "mvhs")]
    school: String,

    /// list available schools
    #[structopt(long)]
    schools: bool,

    /// count down to the next class
    #[structopt(long, short = "u")]
    update: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Cli::from_args();
    let term = Term::stdout();

    if args.schools {
        let schools = reqwest::get("https://api.periods.io/schools")
            .await?
            .json::<Vec<SchoolEntry>>()
            .await?;
        for school in schools {
            term.write_line(&format!("{}", school))?;
        }
        return Ok(());
    }

    let school = async {
        reqwest::get(format!("https://api.periods.io/school/{}", args.school))
            .await?
            .json::<PeriodsSchool>()
            .await
    };
    let calendar = async {
        reqwest::get(format!("https://api.periods.io/schedule/{}", args.school))
            .await?
            .json::<PeriodsCalendar>()
            .await
    };

    let (school, calendar) = try_join!(school, calendar)?;

    let whatsnext = Whatsnext::from_periods(&school, &calendar);

    //println!("{:#?}", resp.text().await?);
    let date = args.date.unwrap_or_else(|| Local::now().naive_local());

    if args.schedule {
        let todays_schedule = whatsnext.day(&date.date());

        //todays_schedule.special_day.name
        term.write_line(&format!("{}", todays_schedule.name))?;
        for class in todays_schedule.classes {
            let time = class.start.time().format("%H:%M").to_string();
            /*if true {//args.time.is_some() && args.date.is_none() {
                time = (class.start.time() - now.time()).hhmmss();
            }*/
            term.write_line(&format!("{} - {}", class.name, time))?;
        }
        return Ok(());
    }

    let green = Style::new().green().bright().bold();
    let red = Style::new().red().bright().bold();
    let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(100));
    interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);

    let start = Local::now().naive_local();

    loop {
        let now = date + (Local::now().naive_local() - start) * args.time_multiplier;

        let next_class = whatsnext
            .timeline(now)
            .next()
            .expect("could not find next class");
        let in_class = next_class.start < now;
        let is_free_class = !school.periods.contains(&next_class.name)
            || school.non_periods.contains(&next_class.name);
        let color = if in_class {
            if is_free_class {
                &green
            } else {
                &red
            }
        } else {
            &green
        };

        term.write_line(&format!("{}", color.apply_to(&next_class.name)))?;

        let duration = if in_class {
            next_class.end - now
        } else {
            next_class.start - now
        };
        term.write_line(&duration.hhmmss())?;

        if !args.update {
            break;
        }

        interval.tick().await;
        term.clear_last_lines(2)?;
    }

    /*let mut timeline = whatsnext.timeline(now);
    for _ in 0..20 {
        println!("{:?} {:?}", timeline.next().unwrap(), &timeline.day.name);
    }*/

    Ok(())
}

/// Parse a time from a string.
/// First look for 12 hour format (%-I:%-M%p)
/// Then for 24-hour format  ("%-H:%-M")
/// Then for just an hour (%-H)
fn parse_time(s: &str) -> Result<NaiveTime, chrono::ParseError> {
    NaiveTime::parse_from_str(s, "%-I:%M%p")
        .or_else(|_e| NaiveTime::parse_from_str(s, "%-H:%M"))
        .or_else(|e| match s.parse::<u32>() {
            Ok(hour) => match NaiveTime::from_hms_opt(hour, 0, 0) {
                Some(time) => Ok(time),
                None => Err(e),
            },
            Err(_err) => Err(e),
        })
}
