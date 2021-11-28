use crate::{Period, Schedule, ScheduleId, SpecialDay, Whatsnext};
use chrono::{Duration, NaiveDate, NaiveTime, Weekday};
use core::fmt;
use serde::Deserialize;
use std::collections::HashMap;

/*struct WhatsnextFormat {
    HashMap<KeyType, >
}

enum KeyType {
    ScheduleId(ScheduleId),
    Weekday(Weekday),
    SpecialDay(NaiveDate),
}
struct WhatsnextFormat {
    monday: Schedule
    tuesday: Schedule
    wednesday: Schedule
    thursday: Schedule
    friday: Schedule
    saturday: Schedule
    sunday: Schedule

    #[serde(flatten)]
    extra: HashMap<String, Schedule>,
}

*/

// schedule.yaml
#[derive(Deserialize, Debug)]
pub struct PeriodsCalendar {
    defaults: Defaults,
    calendar: Vec<CalendarEntry>,
}

#[derive(Deserialize, Debug)]
#[serde(try_from = "String")]
pub struct CalendarEntry {
    name: Option<String>,
    #[serde(with = "month_day_year_slashes")]
    start: NaiveDate,
    #[serde(with = "month_day_year_slashes")]
    end: Option<NaiveDate>,
    schedule: ScheduleId,
}

#[derive(Deserialize, Debug)]
pub struct Defaults {
    #[serde(with = "month_day_year_slashes")]
    start: NaiveDate,
    pattern: Vec<ScheduleId>,
}

// school.yaml
#[derive(Deserialize, Debug)]
pub struct PeriodsSchool {
    periods: Vec<String>,
    #[serde(rename = "non-periods")]
    non_periods: Vec<String>,
    #[serde(flatten)]
    schedules: HashMap<ScheduleId, Schedule>,
}

#[derive(Deserialize)]
pub struct PeriodsSchedule {
    name: String,
    schedule: Option<Vec<PartialClass>>,
}

#[derive(Deserialize, Debug)]
#[serde(try_from = "String")]
pub struct PartialClass {
    start: NaiveTime,
    name: String,
}

impl Whatsnext {

    pub fn from_periods(school: &PeriodsSchool, calendar: &PeriodsCalendar) -> Whatsnext {
        let weekdays = HashMap::from_iter(
            WeekdayIter::new(Weekday::Sun).zip(calendar.defaults.pattern.iter().map(|s| s.clone())),
        );

        let mut special_days = Vec::new();
        for entry in calendar.calendar.iter() {
            for date in DaysBetweenIter::new(entry.start, entry.end) {
                special_days.push((
                    date,
                    SpecialDay {
                        name: entry.name.clone(),
                        schedule: entry.schedule.clone(),
                    },
                ));
            }
        }
        let special_days = HashMap::from_iter(special_days.into_iter());

        Whatsnext {
            schedules: school.schedules.clone(),
            weekdays,
            special_days,
        }
    }
}

impl From<PeriodsSchedule> for Schedule {
    fn from(periods_schedule: PeriodsSchedule) -> Self {
        let mut periods = Vec::<Period>::new();

        let schedule = periods_schedule.schedule.unwrap_or_default();
        let iter = &mut schedule.iter().peekable();
        while let Some(first) = iter.next() {
            let end = iter.peek().unwrap_or(&first);
            periods.push(Period {
                name: first.name.clone(),
                start: first.start,
                end: end.start,
            });
        }

        let periods = periods
            .into_iter()
            .filter(|period| period.name != "Free")
            .collect();

        Schedule {
            name: periods_schedule.name,
            periods,
        }
    }
}

pub enum ParseError {
    MissingPart(String),
    TimeError(chrono::ParseError),
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Self::MissingPart(s) => write!(f, "{}", s),
            Self::TimeError(parse_error) => write!(f, "{}", parse_error),
        }
    }
}

impl From<chrono::ParseError> for ParseError {
    fn from(err: chrono::ParseError) -> Self {
        Self::TimeError(err)
    }
}

impl TryFrom<String> for PartialClass {
    type Error = ParseError;

    fn try_from(string: String) -> Result<Self, Self::Error> {
        let mut parts = string.splitn(2, " ");
        let start = parts
            .next()
            .map(|s| NaiveTime::parse_from_str(s, "%-H:%M"))
            .transpose()?
            .ok_or_else(|| Self::Error::MissingPart("missing time".to_string()))?
            .into();
        let name = parts
            .next()
            .ok_or_else(|| Self::Error::MissingPart("missing name".to_string()))?
            .into();

        Ok(PartialClass { name, start })
    }
}

impl TryFrom<String> for CalendarEntry {
    type Error = ParseError;

    fn try_from(string: String) -> Result<Self, Self::Error> {
        let mut parts = string.splitn(3, " ");
        let mut date_span = parts
            .next()
            .ok_or_else(|| Self::Error::MissingPart("missing date(s)".to_string()))?
            .splitn(2, "-");
        let start = date_span
            .next()
            .map(|s| NaiveDate::parse_from_str(s, month_day_year_slashes::FORMAT))
            .transpose()?
            .ok_or_else(|| Self::Error::MissingPart("missing start date".to_string()))?
            .into();
        let end = date_span
            .next()
            .map(|s| NaiveDate::parse_from_str(s, month_day_year_slashes::FORMAT))
            .transpose()?
            .into();
        let schedule = parts
            .next()
            .ok_or_else(|| Self::Error::MissingPart("missing schedule id".to_string()))?
            .into();
        let name = parts.next().map(str::to_string).into();

        Ok(CalendarEntry {
            name,
            start,
            end,
            schedule,
        })
    }
}

mod month_day_year_slashes {
    use chrono::NaiveDate;
    use serde::{self, Deserialize, Deserializer, Serializer};

    pub const FORMAT: &'static str = "%-m/%-d/%Y";

    // The signature of a serialize_with function must follow the pattern:
    //
    //    fn serialize<S>(&T, S) -> Result<S::Ok, S::Error>
    //    where
    //        S: Serializer
    //
    // although it may also be generic over the input types T.
    pub fn serialize<S>(date: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }

    // The signature of a deserialize_with function must follow the pattern:
    //
    //    fn deserialize<'de, D>(D) -> Result<T, D::Error>
    //    where
    //        D: Deserializer<'de>
    //
    // although it may also be generic over the output types T.
    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDate::parse_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}

struct WeekdayIter {
    weekday: Weekday,
}

impl WeekdayIter {
    fn new(start: Weekday) -> Self {
        WeekdayIter { weekday: start }
    }
}

impl Iterator for WeekdayIter {
    type Item = Weekday;

    fn next(self: &mut Self) -> Option<Self::Item> {
        let day = self.weekday;
        self.weekday = day.succ();
        Some(day)
    }
}

struct DaysBetweenIter {
    date: NaiveDate,
    end: NaiveDate,
}

impl DaysBetweenIter {
    fn new(start: NaiveDate, end: Option<NaiveDate>) -> Self {
        DaysBetweenIter {
            date: start,
            end: end.unwrap_or_else(|| start.clone()),
        }
    }
}

impl Iterator for DaysBetweenIter {
    type Item = NaiveDate;

    fn next(self: &mut Self) -> Option<Self::Item> {
        if self.date > self.end {
            None
        } else {
            let day = self.date;
            self.date = day + Duration::days(1);
            Some(day)
        }
    }
}
