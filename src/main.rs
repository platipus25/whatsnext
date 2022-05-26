use chrono::{Local, NaiveDateTime, NaiveTime};
use chrono_humanize::{Accuracy, Tense};
use console::{Style, Term};
use hhmmss::Hhmmss;
use structopt::StructOpt;
use tabular::{Row, Table};
use whatsnext::parse::SchoolEntry;
use whatsnext::sources;
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

    /// dump the next few classes
    #[structopt(long)]
    next: Option<u32>,
}

struct Config {
    default_school: sources::SchoolId,
    cache_stale_after: std::time::Duration,
    // OAuth something or other
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Cli::from_args();
    let term = Term::stdout();

    if args.schools {
        let schools = reqwest::get("https://bell.plus/api/sources")
            .await?
            .json::<Vec<SchoolEntry>>()
            .await?;
        let mut table = Table::new("{:<} - {:<}");
        for school in schools {
            table.add_row(Row::new().with_cell(school.id).with_cell(school.name));
        }
        print!("{}", table);
        return Ok(());
    }

    let school =
        sources::get_school(&args.school, &chrono::Duration::hours(8).to_std().unwrap()).await?;

    let whatsnext = Whatsnext::new(school);

    //println!("{:#?}", resp.text().await?);
    let date = args.date.unwrap_or_else(|| Local::now().naive_local());

    if args.schedule {
        let todays_schedule = whatsnext.day(&date.date());

        //todays_schedule.special_day.name
        let mut table = Table::new("{:<} - {:<}");
        table.add_heading(todays_schedule.name);
        for class in todays_schedule.classes {
            let time = class.start.time().format("%H:%M").to_string();
            /*if true {//args.time.is_some() && args.date.is_none() {
                time = (class.start.time() - now.time()).hhmmss();
            }*/
            table.add_row(Row::new().with_cell(class.name).with_cell(time));
        }
        print!("{}", table);
        return Ok(());
    }

    if let Some(num) = args.next {
        let timeline = whatsnext.timeline(date);
        let mut table = Table::new("{:<} {:>} {:<}");
        let mut timeline = timeline.skip_while(|class| class.start < date);
        for _ in 0..num {
            let class = timeline.next().unwrap();
            let duration = class.start - date;
            let ht = chrono_humanize::HumanTime::from(duration);
            table.add_row(
                Row::new()
                    //.with_cell(timeline.day.name)
                    .with_cell(class.name)
                    .with_cell(class.start.format("%-I:%M%P"))
                    .with_cell(ht.to_text_en(Accuracy::Rough, Tense::Present)),
            );
        }
        print!("{}", table);
        return Ok(());
    }

    let green = Style::new().green().bright().bold();
    let red = Style::new().red().bright().bold();
    let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(500));
    interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);

    let start = Local::now().naive_local();

    loop {
        let now = date + (Local::now().naive_local() - start) * args.time_multiplier;

        let next_class = whatsnext
            .timeline(now)
            .next()
            .expect("could not find next class");
        let in_class = next_class.start < now;
        let is_free_class = !whatsnext
            .school
            .periods
            .contains(&next_class.name.to_string());
        let color = if in_class {
            if is_free_class {
                &green
            } else {
                &red
            }
        } else {
            &green
        };

        term.write_line(&format!("{}", color.apply_to(next_class.name)))?;

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
