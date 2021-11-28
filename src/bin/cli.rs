use structopt::StructOpt;
use chrono::{Local, NaiveDateTime};
use hhmmss::Hhmmss;
use console::{ Term, Style };

#[derive(StructOpt)]
struct Cli {
    /// the date
    //#[structopt(parse(try_from_str = parse_time))]
    date: Option<NaiveDateTime>,

    #[structopt(long = "multiplier", default_value = "1")]
    time_multiplier: u32,

    /// print the schedule for `date`
    #[structopt(long)]
    schedule: bool,

    // id of periods.io school
    #[structopt(long, default_value = "mvhs")]
    school: String,

    /// List available schools
    #[structopt(long)]
    schools: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>>{
    let args = Cli::from_args();
    let term = Term::stdout();
    let resp = reqwest::get("https://api.periods.io/schedule/mvhs")
        .await?
        .json::<std::collections::HashMap<String, String>>()
        .await?;
    println!("{:#?}", resp);

    let mut date = Local::now();

    Ok(())
}
